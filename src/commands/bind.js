const axios = require("axios");

module.exports = {
  name: "bind",
  async execute(message, args) {
    const token = args[0];

    if (!token) {
      return message.reply("請提供你的 token，例如：`!bind <token>`");
    }

    try {
      const res = await axios.post(`${process.env.BACKEND_URL}/api/bind/discord`, {
        token: token,
        discord_id: message.author.id
      });
      message.reply(`✅ ${res.data.message}`);
    } catch (err) {
      if (err.response?.status === 401) {
        message.reply("❌ token 無效，請確認你的 token 是否正確。");
      } else {
        message.reply("❌ 綁定失敗，請稍後再試。");
      }
    }
  }
};