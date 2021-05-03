import { GuildMember, Message } from "discord.js";
import { errorEmbed } from "../../constants/error_embed";
import { handleVideo, queue, youtube } from "../../handlers/MusicHandler";
import { config } from "../../PandaBot";
import { CommandContext } from "../../types/CommandContext";
import { createCommand, sendError } from "../../utils/helpers";

createCommand({
  name: "play",
  aliases: ["p"],
  description: "Plays a song of your choosing from youtube in a voice channel.",
  category: "Music",
  usages: [`${config.PREFIX}play <song name/song url>`],
  async invoke(ctx: CommandContext) {
    var guild = {};

    const searchString = ctx.args.slice(0).join(" ");

    const url = ctx.args[1] ? ctx.args[1].replace(/<(.+)>/g, "$1") : "";

    const serverQueue = queue.get(ctx.message.guild?.id);
    const voiceChannel = ctx.member?.voice.channel;
    if (!voiceChannel) {
      const embed = errorEmbed;

      embed.setTitle("Error: You must be in a voice channel.");
      embed.setDescription(`\`\`\`You must be in a voice channel.\`\`\``);
      sendError(ctx, embed);
      return;
    }

    const permissions = voiceChannel.permissionsFor(
      ctx.guild?.me as GuildMember
    );
    if (!permissions?.has("CONNECT")) {
      ctx.message.channel.send(
        "I cannot connect in this voice channel, please make sure I have the right permission"
      );
	  return;
    }
    if (!permissions.has("SPEAK")) {
    	ctx.message.channel.send(
        "I cannot speak in this voice channel, please make sure I have the right permission."
      );
	  return;
    }

    ctx.sendMessage(`Searching for ${searchString} on Youtube.`);
    if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
      const playlist = await youtube.getPlayist(url).catch(console.error);

      const videos = await playlist.getVideo();

      for (const video of Object.values(videos)) {
        const video2 = await youtube.getVideoByID((video as any).id);
        await handleVideo(video2, ctx.message, voiceChannel, true);
      }
      ctx.message.channel.send(
        `✅ Playlist: **${playlist.title}** has been added to the queue!`
      );
	  return;
    } else {
      try {
        let videos = await youtube.searchVideos(searchString, 1);
        var video = await youtube.getVideoByID(videos[0].id);
      } catch (error) {
        console.error(error);
      }
      handleVideo(video, ctx.message, voiceChannel);
    }
  },
});
