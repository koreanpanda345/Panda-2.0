import { Guild, TextChannel, GuildMember, User, Message, DMChannel, NewsChannel } from "discord.js";

export interface CommandContext {
	guild: Guild | null;
	guildId: string | undefined;
	channel: TextChannel | DMChannel | NewsChannel;
	channelId: string;
	member: GuildMember | null;
	user: User;
	userId: string;

	sendMessage(content: any): Promise<Message>;
}

export class CommandContext {
	
	constructor(
		public message: Message,
		public args: string[]
	) {
		this.guild = message.guild;
		this.guildId = message.guild?.id;
		this.channel = message.channel;
		this.channelId = message.channel.id;
		this.member = message.member;
		this.user = message.author;
		this.userId = message.author.id;
	}

	async sendMessage(content: any) {
		return this.channel.send(content);
	}
}