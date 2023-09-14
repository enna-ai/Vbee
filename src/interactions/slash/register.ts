import {
	type APIApplicationCommand,
	type APIApplicationCommandOption,
	ApplicationCommandOptionType,
	ApplicationCommandType
} from "discord-api-types/v10";

export default {
	name: "register",
	description: "Create an account with vbusy",
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: "username",
			description: "Create a username",
			type: ApplicationCommandOptionType.String,
			required: true
		},
		{
			name: "email",
			description: "Your vbusy account email",
			type: ApplicationCommandOptionType.String,
			required: true
		},
		{
			name: "password",
			description: "Your vbusy account pw",
			type: ApplicationCommandOptionType.String,
			required: true
		}
	] as APIApplicationCommandOption[],
	dm_permission: false
} as APIApplicationCommand;
