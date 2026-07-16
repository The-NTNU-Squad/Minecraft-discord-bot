const { REST, Routes } = require("discord.js");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

dotenv.config();

const required = ["DISCORD_TOKEN", "CLIENT_ID", "GUILD_ID"];
const missing = required.filter(k => !process.env[k]);
if (missing.length) {
  console.error(`Missing required env vars: ${missing.join(", ")}`);
  process.exit(1);
}

const commands = [];
const commandsPath = path.join(__dirname, "src/commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter(f => f.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if (!command?.data || typeof command.execute !== "function") {
    console.warn(`Skipping invalid command file: ${file}`);
    continue;
  }
  commands.push(command.data.toJSON());
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log(`Registering ${commands.length} guild command(s)...`);

    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );

    console.log("Slash commands registered successfully.");
  } catch (err) {
    console.error("Failed to register commands:", err);
    process.exit(1);
  }
})();
