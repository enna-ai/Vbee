import type { PermissionsString } from "discord.js";

export const token = process.env.BOT_TOKEN as string;
export const developer = process.env.BOT_DEV as string;
export const debug = process.env.DEBUG_MODE === "true";
export const defaultPermissions = ["SendMessages", "ViewChannel"] as PermissionsString[];
