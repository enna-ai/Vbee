import type BeeClient from "@/lib/BeeClient.js";
import Command from "@/lib/command.js";
import { ChatInputCommandInteraction } from "discord.js";
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from "@discordjs/builders";
import { ButtonStyle } from "discord-api-types/v10";
import { isAuthenticated } from "@/utils/helpers.js";
import UserAPI from "@/classes/user.js";
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
		const email = interaction.options.getString("email");
		const password = interaction.options.getString("password");

		try {
			isAuthenticated().then(async (authenticated) => {
				if (authenticated) {
					return interaction.reply({
						content: "You are already logged in! Head to /profile."
					});
				}

				const response = await UserAPI.login(email, password);
				if (response?._id && response.token) {
					const userId = response._id;
					const { token } = response;

					const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
						new ButtonBuilder()
							.setCustomId(`${userId}-logout`)
							.setLabel("Log Out")
							.setStyle(ButtonStyle.Primary)
					);

					await key.setPassword("users", "userId", userId);
					await key.setPassword("tasks", "token", token);

					const userData = await UserAPI.getUserProfile(token);
					const userTasks = userData.tasks.filter((task) => !task.completed && !task.archived);

					const fields = userTasks.map((task: any) => ({
						name: `"${task.task}"`,
						value: `> - Due: ${moment.utc(task.dueDate).format("ddd MMM DD") ?? "No due date"}`
					}));

					await interaction.reply({
						content: `Logged in! Launching your dashboard now... 🐝`,
						ephemeral: true
					});

					const embed = new EmbedBuilder()
						.setAuthor({ name: `Welcome to your dashboard, ${userData.username}!` })
						.addFields(fields)
						.setFooter({ text: `You have (${fields.length}) tasks to do.` })
						.setColor(0xffe35d);
					return interaction.followUp({
						embeds: [embed],
						components: [buttons]
					});
				}
			});
		} catch (error) {
			console.error(error);
		}
	}
}
