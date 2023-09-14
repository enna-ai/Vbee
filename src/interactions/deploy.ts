import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { fileURLToPath, pathToFileURL } from "node:url";
import { globby } from "globby";
import path from "node:path";
import "dotenv/config";

const token = process.env.BOT_TOKEN as string;
if (!token) {
	throw new Error("Application token is missing.");
}

const botId = process.env.BOT_ID as string;
if (!botId) {
	throw new Error("Application ID is missing.");
}

async function loadCommands(): Promise<object[]> {
	const main = fileURLToPath(import.meta.url);
	const directory = `${path.dirname(main) + path.sep}`.replace(/\\/g, "/");

	const commands = [] as object[];

	const commandFiles = await globby(`${directory}/**/*.js`);
	for (const file of commandFiles) {
		const { default: interaction } = await import(pathToFileURL(file).toString());
		commands.push(interaction);
	}

	return commands;
}

const commands = await loadCommands();
const rest = new REST({ version: "10" }).setToken(token);

try {
	console.log("Started refreshing application commands.");

	await rest.put(Routes.applicationCommands(botId), { body: commands });

	console.log("Successfully reloaded application commands!");
} catch (error: unknown) {
	console.error(`${(error as Error).name}: ${(error as Error).message}`);
}
