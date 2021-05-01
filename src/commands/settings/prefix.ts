import { createCommand } from "../../utils/helpers";
import { CommandContext } from "../../types/CommandContext";
import ServerSchema, { IServerSchema } from "../../models/schemas/ServerSchema";
import { CallbackError } from "mongoose";
import { config } from "../../PandaBot";
import { welcomeMessage } from "../../constants/messages";
import { errorEmbed } from "../../constants/error_embed";
import { MessageEmbed } from "discord.js";

createCommand({
	name: "prefix",
	description: "Allows you to either set the prefix, or reset it.",
	permissions: {
		user: ["MANAGE_GUILD"],
	},
	category: "Settings",

	async invoke(ctx: CommandContext) {
		const prefix = ctx.args[0];

		if (!prefix) {
			const embed = errorEmbed;
			embed.setDescription(
				"```Please try this command again, but provide the desired prefix.```"
			);
			embed.setTitle("Argument Error");
			// @ts-ignore
			ctx.message.lineReply(embed);
			return;
		}
		const server = ServerSchema.findOne(
			{ server_id: ctx.guildId },
			(error: CallbackError, record: IServerSchema) => {
				if (record === null) {
					const newRecord = new ServerSchema({
						server_id: ctx.guildId,
						prefix: prefix === "reset" ? config.PREFIX : (prefix as string),
						welcome_channel: "",
						welcome_message: welcomeMessage,
						use_welcome_message: false,
						mod_logs: "",
						use_mod_logs: false,
					});

					return newRecord
						.save()
						.then(() => {
							const embed = new MessageEmbed()
								.setTitle(`Prefix Changed`)
								.setDescription(
									`Changed from \`${config.PREFIX}\` to \`${prefix}\``
								)
								.setColor("GREEN");

							ctx.sendMessage(embed);
						})
						.catch((error) => {
							const embed = errorEmbed;
							embed.setDescription(`\`\`\`${error}\`\`\``);
							embed.setTitle("Database Error");
							// @ts-ignore
							ctx.message.lineReplyNoMention(embed);
						});
				}
				const oldPrefix = record.prefix;
				if (prefix === "reset") {
					record.prefix = config.PREFIX;
					return record
						.save()
						.then(() => {
							const embed = new MessageEmbed()
								.setTitle(`Prefix Changed`)
								.setDescription(
									`Changed from \`${oldPrefix}\` to \`${config.PREFIX}\``
								)
								.setColor("GREEN");

							ctx.sendMessage(embed);
						})
						.catch((error) => {
							const embed = errorEmbed;
							embed.setDescription(`\`\`\`${error}\`\`\``);
							embed.setTitle("Database Error");
							// @ts-ignore
							ctx.message.lineReplyNoMention(embed);
						});
				} else {
					record.prefix = prefix;
					return record
						.save()
						.then(() => {
							const embed = new MessageEmbed()
								.setTitle(`Prefix Changed`)
								.setDescription(
									`Changed from \`${oldPrefix}\` to \`${prefix}\``
								)
								.setColor("GREEN");

							ctx.sendMessage(embed);
						})
						.catch((error) => {
							const embed = errorEmbed;
							embed.setDescription(`\`\`\`${error}\`\`\``);
							embed.setTitle("Database Error");
							// @ts-ignore
							ctx.message.lineReplyNoMention(embed);
						});
				}
			}
		);
	},
});
