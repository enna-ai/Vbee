import type BeeClient from "@/lib/BeeClient.js";
import { fileURLToPath, pathToFileURL } from "node:url";
import { globby } from "globby";
import Command from "@/lib/command.js";
import Event from "@/lib/event.js";
import path from "node:path";

export default class Util {
	public client: BeeClient<true>;

	public constructor(client: BeeClient) {
		this.client = client;
	}

	private isClass(input: unknown): boolean {
		return (
			typeof input === "function" && typeof input.prototype === "object" && input.toString().slice(0, 5) === "class"
		);
	}

	private get directory(): string {
		const main = fileURLToPath(new URL("../bot.js", import.meta.url));
		return `${path.dirname(main) + path.sep}`.replace(/\\/g, "/");
	}

	public async loadCommands(): Promise<void> {
		const commandFiles = await globby(`${this.directory}commands/*.js`);

		for (const file of commandFiles) {
			const { name } = path.parse(file);
			const { default: File } = await import(pathToFileURL(file).toString());
			if (!this.isClass(File)) throw new TypeError(`Command ${name} doesn't export a class.`);

			const command = new File(this.client, name.toLowerCase());
			if (!(command instanceof Command)) throw new TypeError(`Command ${name} doesn't belong in the /commands directory.`);

			this.client.commands.set(command.name, command);
		}
	}

	public async loadEvents(): Promise<void> {
		const eventFiles = await globby(`${this.directory}listeners/**/*.js`);

		for (const file of eventFiles) {
			const { name } = path.parse(file);
			const { default: File } = await import(pathToFileURL(file).toString());
			if (!this.isClass(File)) throw new TypeError(`Event ${name} doesn't export a class.`);

			const event = new File(this.client, name);
			if (!(event instanceof Event)) throw new TypeError(`Event ${name} doesn't belong in /listeners directory.`);
			this.client.events.set(event.name, event);

			event.emitter[event.type](event.name, (...args: unknown[]) => event.run(...args));
		}
	}
}
