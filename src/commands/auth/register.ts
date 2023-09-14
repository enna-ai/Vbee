import type BeeClient from "@/lib/BeeClient.js";
import Command from "@/lib/command.js";
import { ChatInputCommandInteraction } from "discord.js";
import { EmbedBuilder } from "@discordjs/builders";
import UserAPI from "@/classes/user.js";

export default class extends Command {
	public constructor(client: BeeClient) {
		super(client, {
			name: "register",
			description: "Create an account with vbusy"
		});
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async execute(interaction: ChatInputCommandInteraction<"cached" | "raw">) {
		const username = interaction.options.getString("username");
		const email = interaction.options.getString("email");
		const password = interaction.options.getString("password");

		try {
			const response = await UserAPI.register(username, email, password);
			if (!response) {
				return await interaction.reply({
					content: "Interval server error.",
					ephemeral: true
				});
			}

			return await interaction.reply({
				content: `✨ Welcome to Vbusy!`,
				embeds: [
					new EmbedBuilder()
						.setTitle("Your account has been created! 🌱")
						.setDescription("## What's next?\nLogin to your new account using /login and start creating tasks!")
						.setFooter({ text: `Cya around busy bee, ${username}! 🐝` })
						.setColor(0xffe35d)
				],
				ephemeral: true
			});
		} catch (error) {
			console.error(error);
		}
	}
}
