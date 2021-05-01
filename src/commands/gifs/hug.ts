import { createCommand } from "../../utils/helpers";
import { CommandContext } from "../../types/CommandContext";
import { config } from "../../PandaBot";
import { getMember } from "../../utils/resolvers";
import { errorEmbed } from "../../constants/error_embed";
import { nekoClient } from "../../constants/neko_client";
import { MessageEmbed } from 'discord.js';

createCommand({
	name: "hug",
	description: "Allows you to virutally hug someone",
	usages: [`${config.PREFIX}hug <@who>`],
	category: "Fun",
	async invoke(ctx: CommandContext) {
		const result = getMember(ctx, "");

		if(!result) {
			const embed = errorEmbed;
			embed.setTitle(`Error: User Not Found`);
			embed.setDescription(`\`\`\`\nCould not find user\n\`\`\``);
			// @ts-ignore
			ctx.message.lineReply(embed);
			return;
		}

		const {url} = await nekoClient.sfw.hug();

		const embed = new MessageEmbed();
		embed.setTitle(`${ctx.member?.displayName} Hugged ${ctx.guild?.member(result)?.displayName} 🤗`);
		embed.setColor("RANDOM");
		embed.setImage(url);

		ctx.sendMessage(embed);
	}
})