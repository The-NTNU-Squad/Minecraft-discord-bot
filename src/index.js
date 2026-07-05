const { Client, GatewayIntentBits, Collection } = require("discord.js");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

dotenv.config();

const required = ["DISCORD_TOKEN", "PAPER_API", "BOT_API_TOKEN"];
const missing = required.filter(k => !process.env[k]);
if (missing.length) {
  console.error(`Missing required env variables: ${missing.join(", ")}`);
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Collection();

// 載入 commands
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter(f => f.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if (!command?.data || typeof command.execute !== "function") {
    console.warn(`Skipping invalid command file: ${file}`);
    continue;
  }
  client.commands.set(command.data.name, command);
}

// events
require("./events/messageCreate")(client);
require("./events/interactionCreate")(client);
require("./events/photoTransfer")(client);

// HTTP API（Minecraft → Discord）
require("./api/server")(client);

client.once("ready", () => {
  console.log(`Bot logged in as ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);
