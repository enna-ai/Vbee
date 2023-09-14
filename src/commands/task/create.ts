import type BeeClient from "@/lib/BeeClient.js";
import Command from "@/lib/command.js";
import keytar from "keytar";
import { ChatInputCommandInteraction } from "discord.js";
import { EmbedBuilder } from "@discordjs/builders";
import { isAuthenticated } from "@/utils/helpers.js";
import TaskAPI from "@/classes/task.js";

export default class extends Command {
	public constructor(client: BeeClient) {
		super(client, {
			name: "task create",
			description: "Create a new task"
		});
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async execute(interaction: ChatInputCommandInteraction<"cached" | "raw">) {
		const task = interaction.options.getString("task");
		const priority = interaction.options.getString("priority");
		const dueDate = interaction.options.getString("due");

		const token = await keytar.getPassword("tasks", "token");

		try {
			isAuthenticated().then(async (authenticated) => {
				if (!authenticated) {
					return interaction.reply({
						content: "You aren't logged in! Head to /login."
					});
				}

				const newTask = await TaskAPI.createTask(task, priority, dueDate, token);
				if (newTask) {
					return interaction.reply({
						embeds: [
							new EmbedBuilder().setDescription(`Successfully created new task ${newTask.task}!`).setColor(0xffe35d)
						],
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
}
