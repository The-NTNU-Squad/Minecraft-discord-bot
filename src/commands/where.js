const { SlashCommandBuilder } = require("discord.js");
const api = require("../services/paperApi");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("where")
    .setDescription("Show a player's current location")
    .addStringOption(option =>
      option
        .setName("player")
        .setDescription("The player name to look up")
        .setRequired(true)
    ),

  async execute(interaction) {
    const name = interaction.options.getString("player");

    await interaction.deferReply();

    try {
      const data = await api.getPlayer(name);

      await interaction.editReply(
        `📍 ${data.name}\n` +
        `World: ${data.world}\n` +
        `X: ${data.x}\nY: ${data.y}\nZ: ${data.z}`
      );
    } catch (err) {
      if (err.response?.status === 404) {
        return interaction.editReply("找不到該玩家");
      }
      console.error("where command error:", err.message);
      return interaction.editReply("無法連線到伺服器，請稍後再試");
    }
  }
};
