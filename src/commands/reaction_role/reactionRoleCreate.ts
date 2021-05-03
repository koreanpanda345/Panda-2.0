import { Emoji, MessageEmbed } from "discord.js";
import { CallbackError } from "mongoose";
import { client } from "../../constants/client";
import { errorEmbed } from "../../constants/error_embed";
import ReactionRoleSchema, { IReactionRoleSchema } from "../../models/schemas/ReactionRoleSchema";
import { config } from "../../PandaBot";
import { CommandContext } from "../../types/CommandContext";
import { createCommand } from "../../utils/helpers";
import { writeFileSync } from "fs";

createCommand({
	name: "reactionrole create",
	aliases: ["rr c", "rr create"],
	category: "Reaction Role Menu",
	description: "A reaction role command.\nSeparate each reaction-role pair with a |.",
	permissions: {
		user: ["MANAGE_GUILD"],
		self: ["MANAGE_EMOJIS", "MANAGE_ROLES"]
	},
	usages: [`${config.PREFIX}rr c message_id | (emoji) (@role)`],
	async invoke(ctx: CommandContext) {
		if(!ctx.args.length) {
			const embed = errorEmbed;
			embed.setDescription(
				"```Please try this command again, by provide the message id, and the list of reaction-role.```"
			);
			embed.setTitle("Argument Error");
			// @ts-ignore
			sendError(ctx, embed);
			return;
		}
		const message = await ctx.message.channel.messages.fetch(ctx.args[0]);
		ctx.args.shift();
		console.log(ctx.args);
		const menu = ctx.args.join(" ").split("|");
		console.log(menu);
		const exist = await ReactionRoleSchema.findOne({message_id: message.id}, async (error: CallbackError, record: IReactionRoleSchema) => {
			if(record) {
				const embed = errorEmbed;
			embed.setDescription(
				"```Error: There is already a reaction role menu for that message.```"
			);
			embed.setTitle("Reaction Role Already Created.");
			// @ts-ignore
			sendError(ctx, embed);
				return true;
			}
			return false;
		});

		if(exist!) return;
		

		const rrmenu: {emoji_name: string, role_id: string}[] = [];

		for(let pair of menu) {
			pair = pair.trim();
			const _emoji = pair.trim().split(" ")[0].trim();
			const _role = pair.trim().split(" ")[1].trim();

			const role = await ctx.guild?.roles.fetch(_role.split("<@&")[1].split(">")[0]);
			message.react(_emoji);
			rrmenu.push({emoji_name: _emoji, role_id: role!.id});
		}

		const newMenu = new ReactionRoleSchema({
			message_id: message.id,
			reaction_role: rrmenu
		});
		newMenu.save().catch(error => console.error(error));
	}
});
