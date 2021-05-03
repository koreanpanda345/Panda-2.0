import { errorEmbed } from "../../constants/error_embed";
import { CommandContext } from "../../types/CommandContext";
import { createCommand } from "../../utils/helpers";

createCommand({
	name: "addrole",
	category: "Moderation",
	description: "Adds a role to a user.",
	permissions: {
		user: ["MANAGE_ROLES"],
		self: ["MANAGE_ROLES"]
	},
	async invoke(ctx: CommandContext) {
		if(!ctx.args.length) {
			const embed = errorEmbed;
			embed.setDescription(
				"```Please try this command again, but provide the user, and the role that you want to add to the user.```"
			);
			embed.setTitle("Argument Error");
			// @ts-ignore
			sendError(ctx, embed);
			return;
		}

		const role = ctx.message.mentions.roles.first();
		const member = ctx.message.mentions.members?.first();

		if(!role) {
			const embed = errorEmbed;
			embed.setDescription(
				"```Could not find role.```"
			);
			embed.setTitle("Error: Role Not Found");
			// @ts-ignore
			sendError(ctx, embed);
			return;
		}

		if(!member) {
			const embed = errorEmbed;
			embed.setDescription(
				"```Could not find member.```"
			);
			embed.setTitle("Error: Member Not Found");
			// @ts-ignore
			sendError(ctx, embed);
			return;
		}

		member.roles.add(role).catch(error => console.error(error));
		ctx.sendMessage("Added role to user.");
	}
});