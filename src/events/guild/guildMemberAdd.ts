import { GuildMember, MessageEmbed, TextChannel } from "discord.js";
import { CallbackError } from "mongoose";
import { sendModLog } from "../../handlers/ModLogsHandler";
import ServerSchema, { IServerSchema } from "../../models/schemas/ServerSchema";
import { createEvent } from "../../utils/helpers";

createEvent({
	name: "guildMemberAdd",
	async invoke(member: GuildMember) {
		const server = await ServerSchema.findOne({server_id: member.guild.id}, async (error: CallbackError, record: IServerSchema) => {
			if(!record) return false;
			return record;
		});

		if(!server) return;
		//#region Welcome Message
		if(!server.use_welcome_message) return;

		let message = server.welcome_message;

		message = message.replace("{user}", `**${member.user.username}**`);
		message = message.replace("{server}", `**${member.guild.name}**`);
		message = message.replace("{membercount}", `**${member.guild.memberCount.toString()}**`);

		const channel = member.guild.channels.cache.get(server.welcome_channel as string);

		const embed = new MessageEmbed();
		embed.setTitle(`Welcome, ${member.user.username}`);
		if(server!.welcome_image !== "" || server.welcome_image) {
			embed.setImage(server!.welcome_image);
		}
		embed.setDescription(message);
		embed.setColor("RANDOM");

		(channel as TextChannel)!.send(embed);
		const log = new MessageEmbed();
		log.setTitle("Member Joined");
		log.setAuthor(`${member.user.tag}`, member.user.avatarURL() || member.user.defaultAvatarURL);
		log.setDescription(`<@${member.id}>\nMember Count: ${member.guild.memberCount}`);
		log.setColor("GREEN");
		await sendModLog({
			type: "member_joined",
			serverId: member.guild.id,
			embed: log
		});
		//#endregion

		if(!server.use_auto_role) return;

		const role = member.guild.roles.cache.find(x => x.id === server.auto_role_id);

		if(!role) return;

		member.roles.add(role).catch(error => console.error(error));

	}
})