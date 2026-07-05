const { Jimp } = require("jimp");
const axios = require("axios");

// Minecraft 地圖色彩表（144 種）
const MAP_COLORS = [
  [0, 0, 0], [127, 178, 56], [247, 233, 163], [199, 199, 199],
  [255, 0, 0], [160, 160, 255], [167, 167, 167], [0, 124, 0],
  [255, 255, 255], [164, 168, 184], [151, 109, 77], [112, 112, 112],
  [64, 64, 255], [143, 119, 72], [255, 252, 245], [216, 127, 51],
  [178, 76, 216], [102, 153, 216], [229, 229, 51], [127, 204, 25],
  [242, 127, 165], [76, 76, 76], [153, 153, 153], [76, 127, 153],
  [127, 63, 178], [51, 76, 178], [102, 76, 51], [102, 127, 51],
  [153, 51, 51], [25, 25, 25], [250, 238, 77], [92, 219, 213],
  [74, 128, 255], [0, 217, 58], [129, 86, 49], [112, 2, 0],
];

// 找最接近的地圖色彩 index
function nearestColorIndex(r, g, b) {
  let minDist = Infinity;
  let index = 0;
  for (let i = 0; i < MAP_COLORS.length; i++) {
    const [mr, mg, mb] = MAP_COLORS[i];
    const dist = (r - mr) ** 2 + (g - mg) ** 2 + (b - mb) ** 2;
    if (dist < minDist) {
      minDist = dist;
      index = i;
    }
  }
  return index + 4; // Minecraft 地圖色彩從 index 4 開始
}

module.exports = (client) => {
  client.on("messageCreate", async (message) => {
    // 只處理 #phototransfer 頻道
    if (message.channel.name !== "phototransfer") return;
    if (message.author.bot) return;
    if (message.attachments.size === 0) return;

    const attachment = message.attachments.first();
    const isImage = attachment.contentType?.startsWith("image/");
    if (!isImage) {
      return message.reply("請上傳圖片檔案（jpg、png 等）。");
    }

    await message.reply("⏳ 正在處理圖片，請稍後...");

    try {
      // 下載並縮放圖片為 128x128
      const image = await Jimp.fromURL(attachment.url);
      image.resize({ w: 128, h: 128 });

      // 轉換每個像素為地圖色彩 index
      const pixels = [];
      for (let y = 0; y < 128; y++) {
        for (let x = 0; x < 128; x++) {
          const { r, g, b } = image.getPixelColor(x, y);  // ✅ v1 回傳物件
          pixels.push(nearestColorIndex(r, g, b));
        }
      }

      // 傳給 Plugin
      await axios.post(
        `${process.env.PAPER_API}/map-data`,
        { pixels },
        { timeout: 10000 }
      );

      await message.reply("✅ 地圖已建立！在遊戲內輸入 `/getmap` 領取。");
    } catch (err) {
      console.error("photoTransfer error:", err.message);
      await message.reply("❌ 處理失敗，請稍後再試。");
    }
  });
};