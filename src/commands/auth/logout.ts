import type BeeClient from "@/lib/BeeClient.js";
import Command from "@/lib/command.js";
import { ChatInputCommandInteraction } from "discord.js";
import { handleLogout, isAuthenticated } from "@/utils/helpers.js";

export default class extends Command {
	public constructor(client: BeeClient) {
		super(client, {
			name: "logout",
			description: "Logout of your vbusy account"
		});
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async execute(interaction: ChatInputCommandInteraction<"cached" | "raw">) {
		try {
			isAuthenticated().then(async (authenticated) => {
				if (!authenticated) {
					return interaction.reply({
						content: "You are not logged in! Run /login to log in to your account.",
						ephemeral: true
					});
				}

				handleLogout();
				return interaction.reply({
					content: "Logging out... cya later! 🐝"
				});
			});
		} catch (error) {
			console.error(error);
		}
	}
}
