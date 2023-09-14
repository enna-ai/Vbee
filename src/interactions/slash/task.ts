import {
	type APIApplicationCommand,
	type APIApplicationCommandOption,
	ApplicationCommandOptionType,
	ApplicationCommandType
} from "discord-api-types/v10";

export default {
	name: "task",
	description: "Manage your tasks",
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: "create",
			description: "Create a new task!",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "task",
					description: "Provide a new task",
					type: ApplicationCommandOptionType.String,
					max_length: 250,
					required: true
				},
				{
					name: "priority",
					description: "Set a priority level",
					type: ApplicationCommandOptionType.String,
					choices: [
						{ name: "Low", value: "low" },
						{ name: "Medium", value: "medium" },
						{ name: "High", value: "high" }
					],
					required: true
				},
				{
					name: "due",
					description: "Set a due date (YYYY-MM-DD)",
					type: ApplicationCommandOptionType.String
				}
			]
		},
		{
			name: "list",
			description: "View your task list",
			type: ApplicationCommandOptionType.Subcommand
		},
		{
			name: "view",
			description: "View one of your tasks",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "task",
					description: "Provide a task to view",
					type: ApplicationCommandOptionType.String,
					autocomplete: true,
					required: true
				}
			]
		},
		{
			name: "delete",
			description: "Delete one of your tasks",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "task",
					description: "Provide a task to delete",
					type: ApplicationCommandOptionType.String,
					autocomplete: true,
					required: true
				}
			]
		},
		{
			name: "export",
			description: "Export a task to json",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "task",
					description: "Select a task to export",
					type: ApplicationCommandOptionType.String,
					autocomplete: true,
					required: true
				}
			]
		},
		{
			name: "purge",
			description: "Purge all of your tasks",
			type: ApplicationCommandOptionType.Subcommand
		}
	] as APIApplicationCommandOption[],
	dm_permission: false
} as APIApplicationCommand;
