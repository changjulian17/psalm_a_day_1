import json
import random
import asyncio
from telegram import Bot

# --- Telegram Bot Config ---
TOKEN = "TOKEN"      # Replace with your bot token
CHAT_ID = "CHAT_ID"      # Replace with your group chat ID (it will be a negative number)

# Superscript mapping
superscript_map = {str(i): c for i, c in enumerate("⁰¹²³⁴⁵⁶⁷⁸⁹")}
def to_superscript(n): return "".join(superscript_map[d] for d in str(n))

# Load Bible JSON
with open("BSB.json", "r", encoding="utf-8") as f:
    bible_data = json.load(f)

# Pick random Psalm chapter
psalms_book = next(b for b in bible_data["books"] if b["name"].lower() == "psalms")
chapter = random.choice(psalms_book["chapters"])
psalm_text = "\n".join(f"{to_superscript(v['verse'])} {v['text']}" for v in chapter["verses"])

# --- Async function to send message ---
async def main():
    bot = Bot(token=TOKEN)
    await bot.send_message(chat_id=CHAT_ID, text=f"{chapter['name']}:\n{psalm_text}")

# Run the async function
asyncio.run(main())
