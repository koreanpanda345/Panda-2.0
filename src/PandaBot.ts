import {Collection, TextChannel} from "discord.js";
import { Commands } from "./types/Commands";
import {Event} from "./types/Event";
import { loadFiles } from "./utils/helpers";
import { client } from "./constants/client";
import mongoose from "mongoose";


export const cache = {
	commands: new Collection<string, Commands>(),
	events: new Collection<string, Event>()
};

export type Config = {
	TOKEN: string;
	PREFIX: string;
	YT_API_KEY: string;
	MONGO_CONNECTION: string;
	CLIENT_ID: string;
	CLIENT_SECRET: string;
	CALLBACK_URL: string;
	DASHBOARD_URL: string;
}

export const config = process.env as Config;

export class PandaBot {
	start() {
		mongoose.connect(config.MONGO_CONNECTION, {
			useUnifiedTopology: true,
			useNewUrlParser: true
		});
		
		loadFiles("Development").then(() => {
			cache.events.forEach(event => {
				client.on(event.name, async (...args: any[]) => event.invoke(...args));
			});

			client.on('raw', packet => {
				// We don't want this to run on unrelated packets
				if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
				// Grab the channel to check the message from
				const channel = client.channels.cache.get(packet.d.channel_id);
				// There's no need to emit if the message is cached, because the event will fire anyway for that
				if ((channel as TextChannel).messages.cache.has(packet.d.message_id)) return;
				// Since we have confirmed the message is not cached, let's fetch it
				(channel as TextChannel).messages.fetch(packet.d.message_id).then(message => {
					// Emojis can have identifiers of name:id format, so we have to account for that case as well
					const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
					// This gives us the reaction we need to emit the event properly, in top of the message object
					const reaction = message.reactions.cache.get(emoji);
					// Adds the currently reacting user to the reaction's users collection.
					if (reaction) reaction.users.cache.set(packet.d.user_id, client.users.cache.get(packet.d.user_id)!);
					// Check which type of event it is before emitting
					if (packet.t === 'MESSAGE_REACTION_ADD') {
						//@ts-ignore
						client.emit('messageReactionAdd', reaction, client.users.cache.get(packet.d.user_id));
					}
					if (packet.t === 'MESSAGE_REACTION_REMOVE') {
						// @ts-ignore
						client.emit('messageReactionRemove', reaction, client.users.get(packet.d.user_id));
					}
				});
			});

		}).finally(async () => {

			await client.login(config.TOKEN);
		})

	}
}