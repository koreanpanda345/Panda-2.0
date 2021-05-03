import { createEvent, updateFields } from "../../utils/helpers";
import { Message } from "discord.js";
import { cache } from "../../PandaBot";
import { CommandContext } from "../../types/CommandContext";
import ServerSchema, { IServerSchema } from "../../models/schemas/ServerSchema";
import { CallbackError } from "mongoose";
import { defaultConfigurationsServer } from "../../constants/default_configurations";

createEvent({
	name: "message",
	async invoke(message: Message) {
		if(message.author.bot || message.channel.type === "dm" || message.channel.type === "news") return;
		const server = await ServerSchema.findOne({server_id: message.guild?.id}, async (error: CallbackError, record: IServerSchema) => {
			if(!record) {
				const newRecord = defaultConfigurationsServer;
				  
				return newRecord.save()
				.then((value) => {
					console.debug(value);
				}).catch((error) => {
					console.error(error);
				});
			}
			return record;
		});

		
		console.log(server);
		const prefix = server!.prefix;

		if(!(message.content.toLowerCase().trim().startsWith(prefix))) return;

		const args = message.content.slice(prefix.length).trim().split(/ +/g);
		const commandName = args.shift()?.toLowerCase();

		const command = cache.commands.get(commandName as string) || cache.commands.find(cmd => cmd.aliases! && cmd.aliases?.includes(commandName as string)!);
	
		if(!command) return;
		
		const ctx = new CommandContext(message, args);
		await updateFields(ctx);
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