const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bind")
    .setDescription("綁定你的網站帳號到 Discord")
    .addStringOption(option =>
      option
        .setName("token")
        .setDescription("你的帳號 token")
        .setRequired(true)
    ),
  async execute(interaction) {
    const token = interaction.options.getString("token");
    const discordId = interaction.user.id;

    try {
      const res = await axios.post(`${process.env.BACKEND_URL}/api/bind/discord`, {
        token,
        discord_id: discordId
      });
      await interaction.reply({
        content: `✅ ${res.data.message}`,
        flags: MessageFlags.Ephemeral
      });
    } catch (err) {
      const msg = err.response?.status === 401
        ? "❌ token 無效，請確認是否正確。"
        : "❌ 綁定失敗，請稍後再試。";
      await interaction.reply({
        content: msg,
        flags: MessageFlags.Ephemeral
      });
    }
  }
};