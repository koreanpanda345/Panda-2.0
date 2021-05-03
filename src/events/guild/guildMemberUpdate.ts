import { GuildMember } from "discord.js";
import { createEvent } from "../../utils/helpers";

createEvent({
	name: "guildMemberUpdate",
	async invoke(oldMember: GuildMember, newMember: GuildMember) {
		
	}
})