import type BeeClient from "@/lib/BeeClient.js";
import Command from "@/lib/command.js";
import { ChatInputCommandInteraction } from "discord.js";
import { EmbedBuilder } from "@discordjs/builders";
import { isAuthenticated } from "@/utils/helpers.js";
import TaskAPI from "@/classes/task.js";
import key from "keytar";
import moment from "moment";

export default class extends Command {
	public constructor(client: BeeClient) {
		super(client, {
			name: "login",
			description: "Login to your vbusy account"
		});
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async execute(interaction: ChatInputCommandInteraction<"cached" | "raw">) {
		const token = await key.getPassword("tasks", "token");

		try {
			isAuthenticated().then(async (authenticated) => {
				if (authenticated) {
					return interaction.reply({
						content: "You are already logged in! Head to /profile."
					});
				}

				const tasks = await TaskAPI.getTasks(token);
				if (tasks.length === 0) {
					return interaction.reply({
						content: "You haven't made any tasks. :~("
					});
				}

				const fields = tasks.map((task) => {
					const dueDate = task.dueDate ? moment.utc(task.dueDate).format("dddd MM DD") : " ";
					const taskName = task.archived ? `[archived] ${task.task}` : task.task;
					const isCompleted = task.completed;
					const formatTask = isCompleted ? `~~${taskName}~~` : taskName;

					return {
						name: `"${formatTask}"`,
						value: `- Priority: ${task.priority}\n- Due: ${dueDate}`
					};
				});

				const embed = new EmbedBuilder()
					.setTitle(`${interaction.user.username}'s Tasks`)
					.addFields(fields)
					.setColor(0xffe35d);
				return interaction.reply({ embeds: [embed] });
			});
		} catch (error) {
			console.error(error);
		}
	}
}
