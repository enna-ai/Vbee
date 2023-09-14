import type BeeClient from "@/lib/BeeClient.js";
import Event from "@/lib/event.js";
import { Events, type AutocompleteInteraction } from "discord.js";
import { resolveCommandName } from "@/utils/helpers.js";

export default class extends Event {
	public constructor(client: BeeClient) {
		super(client, {
			name: Events.InteractionCreate,
			once: false
		});
	}

	public async run(interaction: AutocompleteInteraction<"cached" | "raw">) {
		if (!interaction.isAutocomplete()) return;

		const command = this.client.commands.get(resolveCommandName(interaction));
		if (command) {
			try {
				await command.autocomplete(interaction);
			} catch (e: unknown) {
				console.error(`${(e as Error).name}: ${(e as Error).message}`);
			}
		}
	}
}
