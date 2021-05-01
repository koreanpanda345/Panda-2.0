import { createCommand } from "../../utils/helpers";
import { CommandContext } from "../../types/CommandContext";
import { config } from "../../PandaBot";
import { getMember } from "../../utils/resolvers";
import { errorEmbed } from "../../constants/error_embed";
import { MessageEmbed, MessageReaction, User, GuildMember, Message } from "discord.js";

createCommand({
	name: "unban",
	description: "bans a user from the server.",
	category: "Moderation",
	usages: [`${config.PREFIX}unban <@who>`],
	permissions: {
		user: ["BAN_MEMBERS"],
		self: ["BAN_MEMBERS"]
	},
	async invoke(ctx: CommandContext) {
		
		const args = ctx.args.join(" ");
		const result = getMember(ctx, args);
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
		if((await ctx.guild?.fetchBans())?.find(x => x.user.id == result.id) === null) {
			const embed = errorEmbed;
			embed.setTitle(`Error: Can't Perform Action.`);
			embed.setDescription(`\`\`\`\nThe requested user can not be banned from the server.\n\`\`\``);
			// @ts-ignore
			ctx.message.lineReply(embed);
			return;
		}
		//	confirmation  yes  no
		const reactions = ['👍', '👎'];
		const user = result as User;
		const confirmationEmbed = new MessageEmbed()
			.setTitle("Confirm Unban.")
			.setDescription("Please verify that you want to unban this person.")
			.addField("User", user.username)
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
						.setTitle('Unban Confirmed.')
						.setDescription(`Banned <@${user.id}>`)
						.setColor('GREEN');
					ctx.guild?.members.unban(user).then(() => {
						msg.edit(embed).then((m: Message) => {
							m.delete({
								timeout: 30000
							});
						});
						yes.stop();
					}).catch((error) => {
						const _errorEmbed = errorEmbed;
						_errorEmbed.setTitle("There was an error when trying to unban this user.");
						_errorEmbed.setDescription(`\`\`\`${error}\`\`\``);
						msg.edit(embed).then((m: Message) => {
							m.delete({
								timeout: 30000
							});
						});
					})


				});

				no.on('collect', (_: unknown) => {
					const embed = new MessageEmbed()
						.setTitle('Unban Cancelled.')
						.setDescription(`Did not unban <@${user.id}>`)
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