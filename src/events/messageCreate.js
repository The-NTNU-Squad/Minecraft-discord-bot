const api = require("../services/paperApi");

module.exports = (client) => {
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    // Discord → Minecraft chat
    if (message.channel.name === "chatlog") {
      await api.sendDiscordChat(
        message.author.username,
        message.content
      );
    }

    // prefix commands (!)
    if (!message.content.startsWith("!")) return;

    const args = message.content.slice(1).split(" ");
    const cmdName = args.shift();

    const command = client.commands.get(cmdName);
    if (!command) return;

    command.execute(message, args);
  });
};
