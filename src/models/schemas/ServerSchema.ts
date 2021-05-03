import mongoose, { Document } from "mongoose";

const Schema = mongoose.Schema;

export interface IServerSchema extends Document {
	server_id: string;
	prefix: string;
	welcome_channel: string;
	welcome_message: string;
	welcome_image: string;
	use_welcome_message: boolean;
	leave_channel: string;
	leave_image: string;
	leave_message: string;
	use_leave_message: boolean;
	send_mod_logs: {name: string, value: boolean}[];
	mod_logs: string;
	use_mod_logs: boolean;
	use_auto_role: boolean;
	auto_role_id: string;
}

const serverSchema = new Schema({
	server_id: String,
	prefix: String,
	welcome_channel: String,
	welcome_message: String,
	welcome_image: String,
	use_welcome_message: Boolean,
	leave_channel: String,
	leave_image: String,
	leave_message: String,
	use_leave_message: Boolean,
	send_mod_logs: [{
		name: String,
		value: Boolean
	}],
	mod_logs: String,
	use_mod_logs: Boolean,
	use_auto_role: Boolean,
	auto_role_id: String
});

export default mongoose.model<IServerSchema>("Server", serverSchema);