import { GuildMember, MessageEmbed, TextChannel } from "discord.js";
import { CallbackError } from "mongoose";
import { leaveMessage } from "../../constants/messages";
import { sendModLog } from "../../handlers/ModLogsHandler";
import ServerSchema, { IServerSchema } from "../../models/schemas/ServerSchema";
import { createEvent } from "../../utils/helpers";

createEvent({
	name: "guildMemberRemove",
	async invoke(member: GuildMember) {
		const server = await ServerSchema.findOne({server_id: member.guild.id}, async (error: CallbackError, record: IServerSchema) => {
			if(!record) return false;
			return record;
		});

		if(!server) return;

		if(typeof server.use_leave_message === "undefined") {
			server.use_leave_message = false;
			server.leave_channel = "";
			server.leave_image = "";
			server.leave_message = leaveMessage;
			server.save().catch(error => console.error(error));
		}

		let message = server.leave_message;

		message = message.replace("{user}", `**${member.user.username}**`);
		message = message.replace("{server}", `**${member.guild.name}**`);
		message = message.replace("{membercount}", `**${member.guild.memberCount.toString()}**`);

		const channel = member.guild.channels.cache.get(server.leave_channel as string);

		const embed = new MessageEmbed();
		embed.setTitle(`${member.user.username} has left the server.`);
		if(server!.leave_image !== "" || server.leave_image) {
			embed.setImage(server!.leave_image);
		}
		embed.setDescription(message);
		embed.setColor("RANDOM");
		if(!channel) return;
		(channel as TextChannel)!.send(embed);
		const log = new MessageEmbed();
		log.setTitle("Member Left");
		log.setAuthor(`${member.user.tag}`, member.user.avatarURL() || member.user.defaultAvatarURL);
		log.setDescription(`<@${member.id}>\nMember Count: ${member.guild.memberCount}`);
		log.setColor("ORANGE");
		await sendModLog({
			type: "member_left",
			serverId: member.guild.id,
			embed: log
		});
	}
})