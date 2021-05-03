import ServerSchema from "../models/schemas/ServerSchema";
import { leaveMessage, welcomeMessage } from "./messages";

export const defaultConfigurationsServer = new ServerSchema({
  server_id: "",
  prefix: "",
  welcome_channel: "",
  welcome_image: "",
  welcome_message: welcomeMessage,
  use_welcome_message: false,
  leave_channel: "",
  leave_image: "",
  leave_message: leaveMessage,
  use_leave_message: "",
  send_mod_logs: [
    {
      name: "member_joined",
      value: true,
    },
    {
      name: "member_left",
      value: true,
    },
    {
      name: "kick",
      value: true,
    },
    {
      name: "ban",
      value: true,
    },
    {
      name: "unban",
      value: true,
    },
  ],
  mod_logs: "",
  use_mod_logs: false,
  use_auto_role: false,
  auto_role_id: ""
});
