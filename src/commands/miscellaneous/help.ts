import { createCommand, sendError } from "../../utils/helpers";
import { CommandContext } from "../../types/CommandContext";
import { MessageEmbed } from "discord.js";
import ServerSchema, { IServerSchema } from "../../models/schemas/ServerSchema";
import { CallbackError } from "mongoose";
import { cache } from "../../PandaBot";
import { errorEmbed } from "../../constants/error_embed";

createCommand({
	name: "help",
	category: "Miscellaneous",
	description: "Displays a list of commands, or information about a specific command.",
	async invoke(ctx: CommandContext) {
		const server = await ServerSchema.findOne({server_id: ctx.guildId}, async (error: CallbackError, record: IServerSchema) =>{
			if(!record) return;
			return record;
		})
		let embed = new MessageEmbed();
		// if there is no argument, then we are going to get the list.
		if(!ctx.args.length) {
			embed.setTitle("List of commands");
			embed.setDescription(`Prefix \`${server!.prefix}\``);
			const category = new Map<string, string[]>();
			cache.commands.forEach((cmd) => {
				if(category.has(cmd.category as string)) {
					category.get(cmd.category as string)?.push(cmd.name);
				}	
				else {
					category.set(cmd.category as string, [cmd.name]);
				}
			});
			for(let [key, value] of category) {
				embed.addField(`${key} [Total Commands: ${value.length}]`, `${value.join('\n')}`);
			}
		}
		// else we are going to get info about a command.
		else {
			const command = cache.commands.get(ctx.args[0]) || cache.commands.find(cmd => cmd.aliases! && cmd.aliases?.includes(ctx.args[0])!);
			if(!command) {
				embed = errorEmbed;
				embed.setTitle("Error: Command not found");
				embed.setDescription(`\`\`\`\nCould not find command\n\`\`\``)
				await sendError(ctx, embed);
				return;
			}

			embed.setTitle(`Infomration on ${command.name}`);
			embed.setDescription(`Description: ${command.description || "No Description was provided."}`);
			if(command.aliases)
				embed.addField("Aliases", command.aliases.join(", "));
		}
		embed.setColor("RANDOM");
		ctx.sendMessage(embed);
	}
})