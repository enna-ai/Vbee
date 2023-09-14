import {
	type APIApplicationCommand,
	type APIApplicationCommandOption,
	ApplicationCommandOptionType,
	ApplicationCommandType
} from "discord-api-types/v10";

export default {
	name: "login",
	description: "Login to your vbusy account",
	type: ApplicationCommandType.ChatInput,
	options: [
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
