const express = require("express");

module.exports = (client) => {
  const app = express();
  app.use(express.json());

  app.use((req, res, next) => {
  if (req.get("X-Auth-Token") !== process.env.BOT_API_TOKEN) {
    return res.sendStatus(401);
  }
  next();

  // Minecraft → Discord chat
  app.post("/mc-chat", (req, res) => {
    const { player, message } = req.body;
    console.log(`收到 MC 聊天: ${player}: ${message}`); 
    const channel = client.channels.cache.find(
      c => c.name === "chatlog"
    );

    if (channel) {
      channel.send(` **${player}**: ${message}`);
    }

    res.sendStatus(200);

    });
  });

  // Minecraft server log → #serverlog 頻道
  app.post("/server-log", (req, res) => {
    const { type, player, message, advancement, command } = req.body;

    const channel = client.channels.cache.find(
      c => c.name === "serverlog"
    );

    if (!channel) {
      console.warn("找不到 serverlog 頻道");
      return res.sendStatus(200);
    }

    let formatted;
    if (type === "death") {
      formatted = ` ${message}`;
    } else if (type === "advancement") {
      formatted = ` **${player}** 獲得了進度 **${advancement}**`;
    } else if (type === "command") {
      formatted = ` **${player}** 輸入了指令：\`${command}\``;
    } else {
      formatted = ` ${JSON.stringify(req.body)}`;
    }

    console.log(`[serverlog] ${formatted}`);
    channel.send(formatted);
    res.sendStatus(200);
  });

  const port = process.env.BOT_PORT || 3000;

  app.listen(port, () => {
    console.log(`Discord Bot API running on ${port}`);
  });
};
