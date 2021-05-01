import { Commands } from "../types/Commands";
import {Event} from "../types/Event";
import { cache } from "../PandaBot";
import { readdirSync } from "fs";
import { MessageEmbed } from "discord.js";
import { CommandContext } from "../types/CommandContext";

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