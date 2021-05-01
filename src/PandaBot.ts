import {Collection} from "discord.js";
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
		}).finally(async () => {

			await client.login(config.TOKEN);
		})

	}
}