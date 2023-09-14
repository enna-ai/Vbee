import { BitField, Client, Partials, PermissionsBitField, type PermissionsString } from "discord.js";
import { AllowedMentionsTypes, GatewayIntentBits } from "discord-api-types/v10";
import { Collection } from "@discordjs/collection";
import type Command from "@/lib/command.js";
import type Event from "@/lib/event.js";
import Util from "@/lib/util.js";

export default class BeeClient<Ready extends boolean = boolean> extends Client<Ready> {
	public commands: Collection<string, Command>;
	public events: Collection<string, Event>;

	public utils: Util;
	public developer: string | undefined;
	public defaultPermissions!: Readonly<BitField<PermissionsString, bigint>>;

	// eslint-disable-next-line no-undef
	public constructor(options: ClientOptions) {
		super({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMembers,
				GatewayIntentBits.GuildMessages
			],
			partials: [Partials.Message, Partials.Channel],
			allowedMentions: {
				parse: [AllowedMentionsTypes.User],
				repliedUser: false
			}
		});

		this.validate(options);
		this.commands = new Collection();
		this.events = new Collection();
		this.utils = new Util(this);
	}

	// eslint-disable-next-line no-undef
	private validate(options: ClientOptions) {
		if (typeof options !== "object") throw new TypeError("Options should be a type of Object.");

		if (!options.token) throw new Error("You must pass the token for the Client.");
		this.token = options.token;

		if (!options.developer) throw new Error("You must pass a list of owner(s) for the Client.");
		this.developer = options.developer;

		if (!options.defaultPermissions.length) throw new Error("You must pass default permission(s) for the Client.");
		if (!Array.isArray(options.defaultPermissions)) {
			throw new TypeError("Permission(s) should be a type of Array<String>.");
		}
		this.defaultPermissions = new PermissionsBitField(options.defaultPermissions).freeze();
	}

	public async initialize(token = this.token) {
		await this.utils.loadCommands();
		await this.utils.loadEvents();
		void super.login(token as string);
	}
}
