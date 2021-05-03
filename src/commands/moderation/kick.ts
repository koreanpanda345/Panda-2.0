import { createCommand } from "../../utils/helpers";
import { CommandContext } from "../../types/CommandContext";
import { config } from "../../PandaBot";
import { getMember } from "../../utils/resolvers";
import { errorEmbed } from "../../constants/error_embed";
import { MessageEmbed, MessageReaction, User, GuildMember, Message } from "discord.js";
import { sendModLog } from "../../handlers/ModLogsHandler";

createCommand({
	name: "kick",
	description: "Kicks a user from the server.",
	category: "Moderation",
	usages: [`${config.PREFIX}kick <@who>, (reason)`],
	permissions: {
		user: ["KICK_MEMBERS"],
		self: ["KICK_MEMBERS"]
	},
	async invoke(ctx: CommandContext) {
		
		const args = ctx.args.join(" ").split(",");
		const result = getMember(ctx, args[0]);
		const reason = args[1] || "No reason was provided";
		// Couldn't find user.
		if(!result) {
			const embed = errorEmbed;
			embed.setTitle(`Error: User Not Found`);
			embed.setDescription(`\`\`\`\nCould not find user\n\`\`\``);
			// @ts-ignore
			ctx.message.lineReply(embed);
			return;
		}

		//If the user can't be banned.
		if(!ctx.guild?.member(result.id)?.kickable) {
			const embed = errorEmbed;
			embed.setTitle(`Error: Can't Perform Action.`);
			embed.setDescription(`\`\`\`\nThe requested user can not be kicked from the server.\n\`\`\``);
			// @ts-ignore
			ctx.message.lineReply(embed);
			return;
		}

		//	confirmation  yes  no
		const reactions = ['👍', '👎'];
		const user = result as User;
		const confirmationEmbed = new MessageEmbed()
			.setTitle("Confirm Kick.")
			.setDescription("Please verify that you want to kick this person.")
			.addField("User", user.username)
			.addField("Reason", `${reason}`)
			.setColor("ORANGE");
		// @ts-ignore
		ctx.message.lineReplyNoMention(confirmationEmbed).then((msg) => {
			msg.react(reactions[0]).then((_: any) => {
				msg.react(reactions[1]);

				const yesFilter = (reaction: MessageReaction, user: User) => {
					return reaction.emoji.name === reactions[0] && user.id === ctx.userId;
				};
				const noFilter = (reaction: MessageReaction, user: User) => {
					return reaction.emoji.name === reactions[1] && user.id === ctx.userId;
				};

				const yes = msg.createReactionCollector(yesFilter, {
					max: 1
				});

				const no = msg.createReactionCollector(noFilter, {
					max: 1
				});

				yes.on('collect', (_: unknown) => {
					const embed = new MessageEmbed()
						.setTitle('Kick Confirmed.')
						.setDescription(`Kicked <@${user.id}>, for reason: \`${reason}\``)
						.setColor('GREEN');
					ctx.guild?.member(user.id)?.kick(reason).then(async () => {
						msg.edit(embed).then((m: Message) => {
							m.delete({
								timeout: 30000
							});
						});
						const log = new MessageEmbed();
						log.setTitle("Mod Action: Kick");
						log.setDescription(`<@${ctx.userId}> kicked <@${user.id}> from the server.`);
						log.addField("Reason for kick:", reason);
						log.addField("Time of kick:", msg.createdAt);
						log.setColor("ORANGE");
						await sendModLog({
							type: "kick",
							serverId: ctx.guildId as string,
							embed: log
						});
						yes.stop();
					}).catch((error) => {
						const _errorEmbed = errorEmbed;
						_errorEmbed.setTitle("There was an error when trying to kick this user.");
						_errorEmbed.setDescription(`\`\`\`${error}\`\`\``);
						msg.edit(embed).then((m: Message) => {
							m.delete({
								timeout: 30000
							});
						});
						yes.stop();
					})


				});

				no.on('collect', (_: unknown) => {
					const embed = new MessageEmbed()
						.setTitle('Kick Cancelled.')
						.setDescription(`Did not kick <@${user.id}>`)
						.setColor('RED');

					msg.edit(embed).then((m: Message) => {
						m.delete({
							timeout: 30000
						});
					});
					no.stop();
				})
			})
		})
	}
})