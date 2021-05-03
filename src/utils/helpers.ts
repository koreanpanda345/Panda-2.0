import { Commands } from "../types/Commands";
import {Event} from "../types/Event";
import { cache, config } from "../PandaBot";
import { readdirSync } from "fs";
import { MessageEmbed } from "discord.js";
import { CommandContext } from "../types/CommandContext";
import ServerSchema, { IServerSchema } from "../models/schemas/ServerSchema";
import { CallbackError } from "mongoose";
import { defaultConfigurationsServer } from "../constants/default_configurations";
import { leaveMessage, welcomeMessage } from "../constants/messages";

export function createCommand(command: Commands) {
	if(cache.commands.has(command.name)) {
		console.warn(`Command ${command.name} has already been loaded.`);
	}
	else {
		cache.commands.set(command.name, command);
	}
}

export function createEvent(event: Event) {
	if(cache.events.has(event.name)) {
		console.warn(`Event ${event.name} has already been loaded.`);
	}
	else {
		cache.events.set(event.name, event);
	}
}

export async function sendError(ctx: CommandContext, embed: MessageEmbed) {
	// @ts-ignore
	return ctx.message.lineReply(embed);
}

export async function updateFields(ctx: CommandContext) {
	const server = await ServerSchema.findOne({server_id: ctx.guildId}, async(error: CallbackError, record: IServerSchema) => {
		if(!record) {
			const newRecord = defaultConfigurationsServer;
			return newRecord.save().catch(error => console.error());
		}
		
		if(typeof record?.server_id === "undefined") record.server_id = ctx.guildId as string;
		if(typeof record?.prefix === "undefined") record.prefix = config.PREFIX;
		if(typeof record?.welcome_channel === "undefined") record.welcome_channel = "";
		if(typeof record.welcome_image === "undefined") record.welcome_image = "";
		if(typeof record.welcome_message === "undefined") record.welcome_message = welcomeMessage;
		if(typeof record.use_welcome_message === "undefined") record.use_welcome_message = false;
		if(typeof record.leave_channel === "undefined") record.leave_channel = "";
		if(typeof record.leave_image === "undefined") record.leave_image = "";
		if(typeof record.leave_message === "undefined") record.leave_message = leaveMessage;
		if(typeof record.use_leave_message === "undefined") record.use_leave_message = false;
		if(typeof record.send_mod_logs === "undefined") record.send_mod_logs = [];
		if(!record.send_mod_logs.find(x => x.name ==="member_joined")) record.send_mod_logs.push({name: "member_joined", value: true});
		if(!record.send_mod_logs.find(x => x.name === "member_left")) record.send_mod_logs.push({name: "member_left", value: true});
		if(!record.send_mod_logs.find(x => x.name === "kick")) record.send_mod_logs.push({name: "kick", value: true});
		if(!record.send_mod_logs.find(x => x.name === "ban")) record.send_mod_logs.push({name: "ban", value: true});
		if(!record.send_mod_logs.find(x => x.name === "unban")) record.send_mod_logs.push({name: "unban", value: true});
		if(typeof record.mod_logs === "undefined") record.mod_logs = "";
		if(typeof record.use_mod_logs === "undefined") record.use_mod_logs = false;
		if(typeof record.use_auto_role === "undefined") record.use_auto_role = false;
		if(typeof record.auto_role_id === "undefined") record.auto_role_id = "";
		record.save().catch(error => console.error());
	});
}

export async function loadFiles(state: "Development" | "Production") {
	const dirs = ["events", "commands"];
	dirs.forEach((dir: string) => {
		const folders = readdirSync(
			`./${state === "Development" ? "src" : "dist"}/${dir}`
		);
		folders.forEach(async (folder) => {
			if (folder.endsWith(state === "Development" ? ".ts" : ".js")) {
				await import(`../${dir}/${folder}`);
			} else {
				const files = readdirSync(
					`./${state === "Development" ? "src" : "dist"}/${dir}/${folder}`
				);
				files.forEach(async (file) => {
					await import(`../${dir}/${folder}/${file}`);
				});
			}
		});
	});
}