import type BeeClient from "@/lib/BeeClient.js";
import Command from "@/lib/command.js";
import keytar from "keytar";
import { AutocompleteInteraction, ChatInputCommandInteraction } from "discord.js";
import { isAuthenticated } from "@/utils/helpers.js";
import TaskAPI from "@/classes/task.js";

export default class extends Command {
	public constructor(client: BeeClient) {
		super(client, {
			name: "task delete",
			description: "Delete a new task"
		});
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async execute(interaction: ChatInputCommandInteraction<"cached" | "raw">) {
		const task = interaction.options.getString("task");
		const token = await keytar.getPassword("tasks", "token");

		try {
			void isAuthenticated().then(async (authenticated) => {
				if (!authenticated) {
					return interaction.reply({
						content: "You aren't logged in! Head to /login."
					});
				}

				const taskToDelete = await TaskAPI.deleteTask(task, token);
				if (taskToDelete) {
					return interaction.reply({
						content: `Successfully deleted "${task}"!`,
						ephemeral: true
					});
				}

				return interaction.reply({
					content: `Interval server error. Unable to save your requst.`,
					ephemeral: true
				});
			});
		} catch (error) {
			console.error(error);
		}
	}

	public override async autocomplete(interaction: AutocompleteInteraction<"cached" | "raw">) {
		const focused = interaction.options.getFocused(true);

		const token = await keytar.getPassword("tasks", "token");
		const tasks = await TaskAPI.getTasks(token);

		const choices = tasks.filter((choice) => choice._id?.startsWith(focused.value));
		return interaction.respond(choices.map((item) => ({ name: item.task?.slice(0, 10), value: item._id })));
	}
}
