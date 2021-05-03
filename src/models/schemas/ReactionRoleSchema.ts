import { Emoji } from "discord.js";
import mongoose, {Document} from "mongoose";

const Schema = mongoose.Schema;

export interface IReactionRoleSchema extends Document {
	message_id: string;
	reaction_role: {
		emoji_name: string,
		role_id: string
	}[];
}

const reactionRoleSchema = new Schema({
	message_id: String,
	reaction_role: [{emoji_name: String, role_id: String}]
});

export default mongoose.model<IReactionRoleSchema>("Reaction Role", reactionRoleSchema);