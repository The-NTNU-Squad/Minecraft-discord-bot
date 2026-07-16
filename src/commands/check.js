const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("check")
    .setDescription("查看你目前綁定的帳號資訊"),
  async execute(interaction) {
    const discordId = interaction.user.id;

    try {
      const res = await axios.get(`${process.env.BACKEND_URL}/api/user/me/discord`, {
        params: { discord_id: discordId }
      });
      const user = res.data;

      await interaction.reply({
        content: [
          `📋 **帳號綁定資訊**`,
          `🌐 網頁帳號：${user.username}`,
          `⛏️ MC 帳號：${user.mc_username ?? "未綁定"}`,
          `💬 Discord：<@${interaction.user.id}>`
        ].join("\n"),
        flags: MessageFlags.Ephemeral
      });
    } catch (err) {
      const msg = err.response?.status === 404
        ? "❌ 你還沒有綁定帳號，請先用 `/bind` 綁定。"
        : "❌ 查詢失敗，請稍後再試。";
      await interaction.reply({
        content: msg,
        flags: MessageFlags.Ephemeral
      });
    }
  }
};