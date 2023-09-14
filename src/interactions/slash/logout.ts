import { type APIApplicationCommand, ApplicationCommandType } from "discord-api-types/v10";

export default {
	name: "logout",
	description: "Logout of your vbusy account",
	type: ApplicationCommandType.ChatInput,
	dm_permission: false
} as APIApplicationCommand;
