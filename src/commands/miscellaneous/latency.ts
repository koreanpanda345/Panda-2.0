import { createCommand } from "../../utils/helpers";
import { CommandContext } from "../../types/CommandContext";
import { MessageEmbed } from "discord.js";
import { client } from "../../constants/client";

createCommand({
	name: "latency",
	description: "Displays my current latency",
	aliases: ["ping"],
	category: "Miscellaneous",
	async invoke(ctx: CommandContext) {
		const embed = new MessageEmbed();

		embed.setTitle("PONG!");
		
		ctx.sendMessage(embed).then((msg) => {
			const time = msg.createdTimestamp - Date.now();
			embed.setTitle("My latency");
			embed.setDescription(`Bot Latency: ${time} ms\nDiscord API latency: ${client.ws.ping} ms`);
			embed.setColor(time > 100 ? "GREEN" : time > 200 ? "ORANGE" : "RED");

			msg.edit(embed);
		});
	}
})