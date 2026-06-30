[README_en.md](https://github.com/user-attachments/files/29516651/README_en.md)
# Minecraft Discord Bot

A Discord bot that bridges a Minecraft (Paper) server with Discord, providing two-way chat bridging, player lookup commands, and real-time logging of server events (deaths, achievements, commands).

## Features

- `/where <player>` — Look up a player's current world and coordinates
- `/playerlist` — Get the list of currently online players
- Two-way chat bridge between Minecraft and Discord
- Server event logging (automatically posted to a dedicated channel):
  -  Player death messages
  -  Player achievements
  -  Commands issued by players

## Architecture

This project must be paired with a Minecraft Paper Plugin ([discord-bridge](#)) to function:

```
Minecraft Server (Paper Plugin)
        ↕ HTTP (authenticated via X-Auth-Token)
   Discord Bot (this project)
        ↕
     Discord Server
```

The Plugin listens for server events and sends them to the Bot over HTTP, which then posts them to the appropriate Discord channel. Conversely, Discord messages are forwarded back to the Plugin and broadcast in-game.

## Installation

### 1. Clone the project

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in the following:

```env
DISCORD_TOKEN=your discord bot token
PAPER_API=http://localhost:8080
BOT_PORT=3000
BOT_API_TOKEN=your own secret string
```

| Variable | Description |
|---|---|
| `DISCORD_TOKEN` | Your Discord bot token |
| `PAPER_API` | The API endpoint exposed by the Minecraft Plugin |
| `BOT_PORT` | Port the Bot's own API listens on |
| `BOT_API_TOKEN` | Shared secret used between the Plugin and Bot; must match the Plugin's `config.yml` |

### 3. Start the bot

```bash
npm start
```

On success you should see:
```
Discord Bot API running on 3000
Bot logged in as your_bot_name
```

## Discord Channel Setup

Create the following channels in your Discord server, and make sure the Bot has permission to send messages in both:

| Channel Name | Purpose |
|---|---|
| `chatlog` | Minecraft ↔ Discord chat bridge |
| `serverlog` | Death / achievement / command logs |

## Companion Minecraft Plugin

This Bot requires a corresponding Paper Plugin to receive in-game data. See the Plugin project's README for setup instructions on that side.

## License

MIT
