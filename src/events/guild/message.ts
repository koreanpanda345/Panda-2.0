import { createEvent } from "../../utils/helpers";
import { Message } from "discord.js";
import { config, cache } from "../../PandaBot";
import { CommandContext } from "../../types/CommandContext";
import ServerSchema, { IServerSchema } from "../../models/schemas/ServerSchema";
import { CallbackError } from "mongoose";
import { welcomeMessage } from "../../constants/messages";

createEvent({
	name: "message",
	async invoke(message: Message) {
		if(message.author.bot || message.channel.type === "dm" || message.channel.type === "news") return;
		const server = await ServerSchema.findOne({server_id: message.guild?.id}, async (error: CallbackError, record: IServerSchema) => {
			if(!record) {
				const newRecord = new ServerSchema({
					server_id: message.guild?.id,
					prefix: config.PREFIX,
					welcome_channel: "",
					welcome_message: welcomeMessage,
					use_welcome_message: false,
					mod_logs: "",
					use_mod_logs: false,
				});
				return newRecord.save().catch((error) => {
					console.error(error);
				});
			}
			return record;
		});

		const prefix = server!.prefix;

		if(!(message.content.toLowerCase().trim().startsWith(prefix))) return;

		const args = message.content.slice(prefix.length).trim().split(/ +/g);
		const commandName = args.shift()?.toLowerCase();

		const command = cache.commands.get(commandName as string) || cache.commands.find(cmd => cmd.aliases! && cmd.aliases?.includes(commandName as string)!);
	
		if(!command) return;
		
		const ctx = new CommandContext(message, args);
		let run = true;
		command.permissions?.user?.forEach((permission) => {
			if(!ctx.member?.hasPermission(permission)) {
				run = false;
				ctx.message.reply(`You are missing the permission of \`${permission}\`.`);
				return;
			}
		});
		
		if(!run) return;

		command.permissions?.self?.forEach((permission) => {
			if(!ctx.guild?.me?.hasPermission(permission)) {
				run = false;
				ctx.message.reply(`I am missing the permission of \`${permission}\`.`);
				return;
			}
		});

		if(!run) return;

		try {
			await command.invoke(ctx);
		} catch(error) {
			console.error(error);
		}
	}
});