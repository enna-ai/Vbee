import type BeeClient from "@/lib/BeeClient.js";
import Event from "@/lib/event.js";
import { Events } from "discord.js";
import { ActivityType } from "discord-api-types/v10";

export default class extends Event {
	public constructor(client: BeeClient) {
		super(client, {
			name: Events.ClientReady,
			once: true
		});
	}

	public run() {
		this.client.user.setPresence({
			status: "dnd",
			activities: [
				{
					type: ActivityType.Custom,
					name: "DND. v busy! 🐝"
				}
			]
		});

		console.log(`Logged in as ${this.client.user.username}!`);
		console.log(`Loaded ${this.client.commands.size} commands + ${this.client.events.size} listeners.`);
	}
}
