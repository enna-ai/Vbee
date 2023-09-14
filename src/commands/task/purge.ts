import type BeeClient from "@/lib/BeeClient.js";
import Command from "@/lib/command.js";
import keytar from "keytar";
import { ChatInputCommandInteraction } from "discord.js";
import { isAuthenticated } from "@/utils/helpers.js";
import TaskAPI from "@/classes/task.js";

export default class extends Command {
	public constructor(client: BeeClient) {
		super(client, {
			name: "task purge",
			description: "Purge your tasks"
		});
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async execute(interaction: ChatInputCommandInteraction<"cached" | "raw">) {
		const token = await keytar.getPassword("tasks", "token");
		const userId = await keytar.getPassword("users", "userId");

		try {
			isAuthenticated().then(async (authenticated) => {
				if (!authenticated) {
					return interaction.reply({
						content: "You aren't logged in! Head to /login."
					});
				}

				const deleteAllTasks = await TaskAPI.purgeTasks(userId, token);
				if (deleteAllTasks) {
					return interaction.reply({
						content: "Successfully deleted all of your tasks.",
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
