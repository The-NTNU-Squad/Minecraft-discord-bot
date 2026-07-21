const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("checkin")
    .setDescription("每日簽到，登入 Minecraft 後獲得一顆綠寶石"),
  async execute(interaction) {
    const discordId = interaction.user.id;

    try {
      const res = await axios.post(`${process.env.BACKEND_URL}/api/checkin/discord`, {
        discord_id: discordId
      });
      await interaction.reply({
        content: `✅ ${res.data.message}`,
        flags: MessageFlags.Ephemeral
      });
    } catch (err) {
      const msg = err.response?.status === 409
        ? "❌ 你今天已經簽到過了，明天再來！"
        : err.response?.status === 404
        ? "❌ 找不到綁定帳號，請先用 `/bind` 綁定。"
        : "❌ 簽到失敗，請稍後再試。";
      await interaction.reply({
        content: msg,
        flags: MessageFlags.Ephemeral
      });
    }
  }
};