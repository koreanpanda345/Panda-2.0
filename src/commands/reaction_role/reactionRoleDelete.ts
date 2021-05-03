import { Emoji, MessageEmbed } from "discord.js";
import { CallbackError } from "mongoose";
import { client } from "../../constants/client";
import { errorEmbed } from "../../constants/error_embed";
import ReactionRoleSchema, { IReactionRoleSchema } from "../../models/schemas/ReactionRoleSchema";
import { config } from "../../PandaBot";
import { CommandContext } from "../../types/CommandContext";
import { createCommand } from "../../utils/helpers";

createCommand({
	name: "reactionrole delete",
	aliases: ["rr d", "rr delete"],
	category: "Reaction Role Menu",
	description: "Deletes the reaction role menu.",
	permissions: {
		user: ["MANAGE_GUILD"],
		self: ["MANAGE_EMOJIS", "MANAGE_ROLES"]
	},
	usages: [`${config.PREFIX}rr d <message id>`],
	async invoke(ctx: CommandContext) {
		if(!ctx.args.length) {
			const embed = errorEmbed;
			embed.setDescription(
				"```Please try this command again, but provide the message id.```"
			);
			embed.setTitle("Argument Error");
			// @ts-ignore
			sendError(ctx, embed);
			return;
		}
		const message = await ctx.message.channel.messages.fetch(ctx.args[0]);
		const rrmenu = await ReactionRoleSchema.findOne({message_id: message.id}, async (error: CallbackError, record: IReactionRoleSchema) => {
			if(!record) {
				const embed = errorEmbed;
			embed.setDescription(
				"```Error: There doesn't seem to be a reaction role menu on that message.```"
			);
			embed.setTitle("Reaction Role Doesn't Exist.");
			// @ts-ignore
			sendError(ctx, embed);
				return true;
			}
			return record;
		});
		rrmenu?.delete().catch(error => console.error(error));
		ctx.sendMessage("Deleted the reaction role menu.");
	}
});
