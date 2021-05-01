import {PermissionResolvable} from "discord.js";
import { CommandContext } from "./CommandContext";

export interface Commands {
	name: string;
	aliases?: string[];
	description?: string;
	category?: string;
	usages?: string[];
	permissions?: {
		user?: PermissionResolvable[];
		self?: PermissionResolvable[];
	};
	precondition?: ((ctx: CommandContext) => Promise<boolean>)[];
	invoke(ctx: CommandContext): Promise<void>;
}