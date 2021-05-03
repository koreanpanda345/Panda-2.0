import { client } from "../../constants/client";
import { errorEmbed } from "../../constants/error_embed";
import { CommandContext } from "../../types/CommandContext";
import { createCommand, sendError } from "../../utils/helpers";


createCommand({
	name: "emit",
	category: "Dev",
	description: "Emits a event. This is only for the developer.",
	async invoke(ctx: CommandContext) {
		if(!ctx.args.length) {
			ctx.sendMessage("Event was not specificed.");
			return;
		}
		try {
			client.emit(ctx.args[0], ctx.member);
		} catch(error) {
			const embed = errorEmbed;
			embed.setTitle(`Error occured when trying to emit ${ctx.args[0]}`);
			embed.setDescription(`\`\`\`\n${error}\n\`\`\``);
			sendError(ctx, embed);
			return;
		}

	}
})