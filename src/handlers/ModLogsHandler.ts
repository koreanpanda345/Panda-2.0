import { MessageEmbed, TextChannel } from "discord.js";
import { CallbackError } from "mongoose";
import { client } from "../constants/client";
import ServerSchema, { IServerSchema } from "../models/schemas/ServerSchema";
import { CommandContext } from "../types/CommandContext";

export type ModLog = {
	type: string;
	serverId: string;
	embed: MessageEmbed;
};

export async function sendModLog(data: ModLog) {
	
	const server = await ServerSchema.findOne({server_id: data.serverId}, async(error: CallbackError, record: IServerSchema) => {
		if(!record) return false;
		return record;
	});

	if(!server!.use_mod_logs) return;

	if(!await isLogEnabled(data.type, data.serverId as string)) return;
	
	const channel = (await client.guilds.fetch(data.serverId))?.channels.cache.get(server!.mod_logs as string);
	
	if(!channel) return;
	
	(channel as TextChannel).send(data.embed);
}

async function isLogEnabled(type: string, serverId: string) {
	
	const server = await ServerSchema.findOne({server_id: serverId}, async(error: CallbackError, record: IServerSchema) => {
		if(!record) return false;
		return record;
	});

	if(!server) return false;
	return server!.send_mod_logs.find(x => x.name === type)!;
}