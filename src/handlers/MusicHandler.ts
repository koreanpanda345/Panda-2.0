import { Message, VoiceChannel, Util, TextChannel, DMChannel, NewsChannel, VoiceConnection } from "discord.js";

const queue = new Map();

export async function handleVideo(video: any, message: Message, voiceChannel: VoiceChannel, playlist = false) {
	const serverQueue = queue.get(message.guild?.id);
	console.log(video);
	const song = {
		id: video.id,
		title: Util.escapeMarkdown(video.title),
		url: `https://www.youtube.com/watch?v=${video.id}`,
		channel: video.channel.title,
		durationm: video.duration.minutes,
		durations: video.duration.seconds,
		durationh: video.duration.hours
	};

	if(!serverQueue) {
		const queueConstruct: {
			textChannel: TextChannel | DMChannel | NewsChannel,
			voiceChannel: VoiceChannel,
			connection: VoiceConnection | null,
			songs: Array<any>,
			volume: number,
			playing: boolean
		} = {
			textChannel: message.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: new Array<any>(),
			volume: 5,
			playing: true
		};

		queue.set(message.guild?.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(message.guild, queueConstruct.songs[0]);
		} catch(error) {
			console.error(`I could not join the voice channel: ${error}`);
			queue.delete(message.guild?.id);
			return message.channel.send(`I could not join the voice channel: ${error}`);
		}
	}
}