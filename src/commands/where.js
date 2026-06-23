const api = require("../services/paperApi");

module.exports = {
  name: "where",

  async execute(message, args) {
    const name = args[0];

    if (!name) {
      return message.reply("請輸入玩家名稱");
    }

    try {
      const data = await api.getPlayer(name);

      message.reply(
        `📍 ${data.name}\n` +
        `World: ${data.world}\n` +
        `X: ${data.x}\nY: ${data.y}\nZ: ${data.z}`
      );
    } catch (err) {
      message.reply("找不到該玩家");
    }
  }
};
