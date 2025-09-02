from telegram import Bot

TOKEN = "YOUR_BOT_TOKEN"
bot = Bot(token=TOKEN)

updates = bot.get_updates()
for u in updates:
    if u.message:
        print(u.message.chat.id)
