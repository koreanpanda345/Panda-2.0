import { CommandContext } from "../types/CommandContext";


export function getMember(ctx: CommandContext, search: string) {
	console.log(search)
	let user;
	if(ctx.message.mentions.users.size > 0)
		user = ctx.message.mentions.users.first();
	// else user = ctx.guild?.members.cache.get(search) || ctx.guild?.members.cache.find(u => {
	// 	console.log(u.user.username);
	// 	return false;
	// });
	if(!user) return false;
	return user;
}