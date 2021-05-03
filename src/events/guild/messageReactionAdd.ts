import { MessageReaction, Role, User } from "discord.js";
import { CallbackError } from "mongoose";
import ReactionRoleSchema, { IReactionRoleSchema } from "../../models/schemas/ReactionRoleSchema";
import { createEvent } from "../../utils/helpers";

createEvent({
	name: "messageReactionAdd",
	async invoke(msg: MessageReaction, user: User) {
		const menu = await ReactionRoleSchema.findOne({message_id: msg.message.id}, async(error: CallbackError, record: IReactionRoleSchema) => {
			if(!record) return;
			return record;
		});

		if(!menu) return;

		const emoji = msg.emoji;

		if(menu.reaction_role.find(x => x.emoji_name === emoji.name) === undefined) return;

		let roleId = menu.reaction_role.find(x => x.emoji_name === emoji.name)?.role_id;
		const role = await (await msg.message.guild?.roles.cache.find(x => x.id === roleId));

		const member = msg.message.guild?.member(user);

		if(member?.roles.cache.has(role?.id as string)) return;
		member?.roles.add(role as Role);
	}
})