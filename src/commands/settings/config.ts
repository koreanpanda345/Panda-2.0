import { MessageEmbed } from "discord.js";
import { CallbackError } from "mongoose";
import { errorEmbed } from "../../constants/error_embed";
import ServerSchema, { IServerSchema } from "../../models/schemas/ServerSchema";
import { CommandContext } from "../../types/CommandContext";
import { createCommand, sendError } from "../../utils/helpers";

createCommand({
  name: "config",
  category: "Settings",
  description: "Configures the bot for the server",
  permissions: {
    user: ["MANAGE_GUILD"],
  },
  async invoke(ctx: CommandContext) {
    const server = await ServerSchema.findOne(
      { server_id: ctx.guildId },
      async (error: CallbackError, record: IServerSchema) => {
        if (!record) return;
        return record;
      }
    );

    let embed = new MessageEmbed();
    // get all of the configurations.
    if (!ctx.args.length) {
      embed.setTitle(`Configurations for ${ctx.guild?.name}`);
      
	  embed.addField("Welcome Module Enabled", server?.use_welcome_message, true);
      embed.addField("Welcome Message", server?.welcome_message, true);
      embed.addField("Welcome Channel", `<#${server?.welcome_channel}>`, true);
	  
	  embed.addField("Leave Module Enabled", server?.use_leave_message, true);
	  embed.addField("Leave Message", server?.leave_message, true);
	  embed.addField("Leave Channel", `<#${server?.leave_channel}>`, true);
	 
	  embed.addField("Welcome Image", server?.welcome_image === "" ? "---" : server?.welcome_image, true);
	  embed.addField("\u200b", "\u200b", true);
	  embed.addField("Leave Image", server?.leave_image === "" ? "---" : server?.leave_image, true); 
	 
	  embed.addField("Mod Logs Module Enabled:", server?.use_mod_logs, true);
	  embed.addField("\u200b", "\u200b", true);
      embed.addField("Mod Log Channel", `<#${server?.mod_logs}>`, true);
    } else {
      switch (ctx.args[0]) {
        case "disable":
          switch (ctx.args[1]) {
            case "welcome":
              server!.use_welcome_message = false;
              server?.save().catch((error) => console.error(error));
              ctx.sendMessage("Disabled the welcome module.");
              break;
            case "leave":
              server!.use_leave_message = false;
              server?.save().catch((error) => console.error(error));
              ctx.sendMessage("Disabled the leave module.");
              break;
            case "mod_logs":
              server!.use_mod_logs = false;
              server?.save().catch((error) => console.error(error));
              ctx.sendMessage("Disabled the mod logs module.");
              break;
			case "auto_role":
				server!.use_auto_role = false;
				server?.save().catch((error) => console.error(error));
				ctx.sendMessage("Disabled the auto role module.");
			break;
          }
          break;
        case "enable":
          switch (ctx.args[1]) {
            case "welcome":
              server!.use_welcome_message = true;
              server?.save().catch((error) => console.error(error));
              ctx.sendMessage("Enabled the welcome module.");
              break;
            case "leave":
              server!.use_leave_message = true;
              server?.save().catch((error) => console.error(error));
			  ctx.sendMessage("Enabled the leave module.");
              break;
            case "mod_logs":
              server!.use_mod_logs = true;
              server?.save().catch((error) => console.error(error));
              ctx.sendMessage("Enabled the mod logs module.");
              break;
			case "auto_role":
				server!.use_auto_role = true;
				server?.save().catch((error) => console.error(error));
				ctx.sendMessage("Enabled the auto role module.");
			break;
          }
          break;
		case "auto_role":
		  switch(ctx.args[1]) {
			  case "role":
				  const role = ctx.message.mentions.roles.first();
				  if(!role) {
					embed = errorEmbed;
					embed.setTitle("Error: Missing Role Mention");
					embed.setDescription("```You must mention a role.```");
					sendError(ctx, embed);
					return;
				  }
				  server!.auto_role_id = role.id;
				  ctx.sendMessage(`Set the auto role to ${role.name}`);
				  server?.save().catch(error => console.error(error));
				  break;
		  }
		break;
        case "leave":
          switch (ctx.args[1]) {
            case "channel":
              const channel = ctx.message.mentions.channels.first();
              if (!channel) {
                embed = errorEmbed;
                embed.setTitle("Error: Missing Channel Mention");
                embed.setDescription("```You must mention a channel.```");
                sendError(ctx, embed);
                return;
              }
              server!.leave_channel = channel.id;
              ctx.sendMessage(`Set the leave channel to <#${channel.id}>`);
              server?.save().catch((error) => console.error(error));
              break;
            case "image":
              if (!ctx.args.length) {
                embed = errorEmbed;
                embed.setTitle("Error: Image Url");
                embed.setDescription("```You must provide a image url.```");
                sendError(ctx, embed);
                return;
              }

              server!.leave_image = ctx.args[2];
              server!.save().catch((error) => console.error(error));
              ctx.sendMessage(`Set the image`);
              break;
          }
          break;
        case "mod_logs":
          switch (ctx.args[1]) {
            case "channel":
              const channel = ctx.message.mentions.channels.first();
              if (!channel) {
                embed = errorEmbed;
                embed.setTitle("Error: Missing Channel Mention");
                embed.setDescription("```You must mention a channel.```");
                sendError(ctx, embed);
                return;
              }
              server!.mod_logs = channel.id;
              ctx.sendMessage(`Set the mod logs channel to <#${channel.id}>`);
              server?.save().catch((error) => console.error(error));
              break;
          }
          break;
        case "welcome":
          switch (ctx.args[1]) {
            case "channel":
              const channel = ctx.message.mentions.channels.first();
              if (!channel) {
                embed = errorEmbed;
                embed.setTitle("Error: Missing Channel Mention");
                embed.setDescription("```You must mention a channel.```");
                sendError(ctx, embed);
                return;
              }
              server!.welcome_channel = channel.id;
              ctx.sendMessage(`Set the welcome channel to <#${channel.id}>`);
              server?.save().catch((error) => console.error(error));
              break;
            case "image":
              if (!ctx.args.length) {
                embed = errorEmbed;
                embed.setTitle("Error: Image Url");
                embed.setDescription("```You must provide a image url.```");
                sendError(ctx, embed);
                return;
              }

              server!.welcome_image = ctx.args[2];
              server!.save().catch((error) => console.error(error));
              ctx.sendMessage(`Set the image`);
              break;
          }
          break;
      }
    }
	embed.setColor("RANDOM");
    ctx.sendMessage(embed);
  },
});
