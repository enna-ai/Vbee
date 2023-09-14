import type { AutocompleteInteraction, CommandInteraction } from "discord.js";
import UserAPI from "@/classes/user.js";
import key from "keytar";

export const formatArray = (input: string[], options: { style?: Intl.ListFormatStyle; type?: Intl.ListFormatType } = {}): string => {
	const { style = "short", type = "conjunction" } = options;
	return new Intl.ListFormat("en-US", { style, type }).format(input);
};

export const formatPermissions = (input: string): string => input
	.replace(/(?<!^)([A-Z][a-z]|(?<=[a-z])[A-Z])/g, " $1")
	.replace(/To|And|In\b/g, (txt) => txt.toLowerCase())
	.replace(/ Instant| Embedded/g, "")
	.replace(/Guild/g, "Server")
	.replace(/Moderate/g, "Timeout")
	.replace(/TTS/g, "Text-to-Speech")
	.replace(/Use VAD/g, "Use Voice Activity");

export const resolveCommandName = (interaction: CommandInteraction<"cached" | "raw"> | AutocompleteInteraction<"cached" | "raw">): string => {
	if (!interaction.isChatInputCommand() && !interaction.isAutocomplete()) return interaction.commandName;

	const topLevelCommand = interaction.commandName;
	const subCommandGroup = interaction.options.getSubcommandGroup(false);
	const subCommand = interaction.options.getSubcommand(false);

	const command = [
		topLevelCommand,
		...(subCommandGroup ? [subCommandGroup] : []),
		...(subCommand ? [subCommand] : [])
	].join(" ");

	return command;
};

export const isAuthenticated = async () => {
	const token = await key.getPassword("tasks", "token");
	return Boolean(token);
};

export const handleLogin = async () => {
	const token = await key.getPassword("tasks", "token");
	const data = await UserAPI.getUserProfile(token);
	return data;
};

export const handleLogout = async () => {
	try {
		await UserAPI.logout();
		await key.deletePassword("tasks", "token");
	} catch (error) {
		console.error(`Error trying to logout: ${error}`);
	}
};

export const handleRegister = async (username: string, email: string, password: string) => {
	const response = await UserAPI.register(username, email, password);
	return response;
};

export const getProfile = async (token: string) => {
	const response = await UserAPI.getUserProfile(token);
	return response;
};
