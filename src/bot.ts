import "dotenv/config";

import BeeClient from "@/lib/BeeClient.js";
import * as Config from "@/utils/config.js";

const client = new BeeClient(Config);
void client.initialize();
