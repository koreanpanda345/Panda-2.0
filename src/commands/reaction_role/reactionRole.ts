import { MessageEmbed } from "discord.js";
import { cache } from "../../PandaBot";
import { CommandContext } from "../../types/CommandContext";
import { createCommand } from "../../utils/helpers";

createCommand({
	name: "reactionrole",
	aliases: ["rr"],
	category: "Reaction Role Menu",
	description: "A reaction role command.",
	permissions: {
		user: ["MANAGE_GUILD"],
		self: ["MANAGE_EMOJIS", "MANAGE_ROLES"]
	},
	async invoke(ctx: CommandContext) {
		if(!ctx.args.length) {
			const embed = new MessageEmbed();
			embed.setTitle("List of subcommands for reaction role.");
			embed.addField("create", "Creates a new reaction role menu.");
			embed.addField("delete", "Deletes the reaction role menu on a certain message.");
			embed.setColor("RANDOM");
			ctx.sendMessage(embed);
			return;
		}

		switch(ctx.args[0]) {
			case 'c':
			case 'create':
				ctx.args.shift();
				await cache.commands.get("reactionrole create")?.invoke(ctx);
			break;
			case 'd':
			case 'delete':
				ctx.args.shift();
				await cache.commands.get("reactionrole delete")?.invoke(ctx);
				break;
		}
		
	}
})