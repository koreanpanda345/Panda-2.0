import mongoose, { Document } from "mongoose";

const Schema = mongoose.Schema;

export interface IServerSchema extends Document {
	server_id: string;
	prefix: string;
	welcome_channel: string;
	welcome_message: string;
	use_welcome_message: boolean;
	mod_logs: string;
	use_mod_logs: boolean;
}

const serverSchema = new Schema({
	server_id: String,
	prefix: String,
	welcome_channel: String,
	welcome_message: String,
	use_welcome_message: Boolean,
	mod_logs: String,
	use_mod_logs: Boolean
});

export default mongoose.model<IServerSchema>("Server", serverSchema);