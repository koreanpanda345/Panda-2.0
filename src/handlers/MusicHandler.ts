import {
  Message,
  VoiceChannel,
  Util,
  TextChannel,
  DMChannel,
  NewsChannel,
  VoiceConnection,
  Guild,
  MessageEmbed,
} from "discord.js";
import ytdl from "ytdl-core";
import { config } from "../PandaBot";

export const queue = new Map();
const Youtube = require("simple-youtube-api");
export const youtube = new Youtube(config.YT_API_KEY);
export async function handleVideo(
  video: any,
  message: Message,
  voiceChannel: VoiceChannel,
  playlist = false
) {
  const serverQueue = queue.get(message.guild?.id);
  console.log(video);
  const song = {
    id: video.id,
    title: Util.escapeMarkdown(video.title),
    url: `https://www.youtube.com/watch?v=${video.id}`,
    channel: video.channel.title,
    durationm: video.duration.minutes,
    durations: video.duration.seconds,
    durationh: video.duration.hours,
  };

  if (!serverQueue) {
    const queueConstruct: {
      textChannel: TextChannel | DMChannel | NewsChannel;
      voiceChannel: VoiceChannel;
      connection: VoiceConnection | null;
      songs: Array<any>;
      volume: number;
      playing: boolean;
    } = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: new Array<any>(),
      volume: 5,
      playing: true,
    };

    queue.set(message.guild?.id, queueConstruct);

    queueConstruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueConstruct.connection = connection;
      play(message.guild!, queueConstruct.songs[0]);
    } catch (error) {
      console.error(`I could not join the voice channel: ${error}`);
      queue.delete(message.guild?.id);
      return message.channel.send(
        `I could not join the voice channel: ${error}`
      );
    }
  } else {
	serverQueue.songs.push(song);
	let songAddedEmbed = new MessageEmbed()
	.setTitle(`${song.title} has been added to the queue`)
	.setColor(`0xff3262`)
	.addField(`Publisher: `, `${song.channel}`, true)
	.addField('Video ID: ', song.id, true)
	.addField(`Duration: `, `**${song.durationh}** hours: **${song.durationm}** minutes: **${song.durations}** seconds`)
	.setThumbnail(`https://i.ytimg.com/vi/${song.id}/sddefault.jpg`)
	.setDescription(`[${song.title}](https://www.youtube.com/watch?v=${song.id}})`)
	if (playlist) return undefined;

	else return message.channel.send(songAddedEmbed);
  }
  return undefined;
}

function play(guild: Guild, song: any) {
  const serverQueue = queue.get(guild.id);

  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  console.log(serverQueue.songs);

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", (reason: any) => {
      if (reason === "Stream is not generating quickly enough.")
        console.log("Song ended.");
      else console.log(reason);
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", (error: any) => console.error(error));

  setTimeout(() => {
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    let songEmbed = new MessageEmbed()
      .setColor(`0xff3262`)
      .addField(`Publisher: `, `${song.channel}`, true)
      .addField("Video ID: ", song.id, true)
      .addField(
        `Duration: `,
        `**${song.durationh}** hours: **${song.durationm}** minutes: **${song.durations}** seconds`
      )
      .setThumbnail(`https://i.ytimg.com/vi/${song.id}/sddefault.jpg`)
      .setDescription(
        `[${song.title}](https://www.youtube.com/watch?v=${song.id}})`
      );

    serverQueue.textChannel.send(songEmbed);
  }, 500);
}
