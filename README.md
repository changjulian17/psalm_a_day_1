---

# Random Psalm Telegram Bot

A Python script that sends a **random chapter from the Book of Psalms** to a Telegram chat or group daily, with verse numbers displayed as superscripts. Designed to run on PythonAnywhere or any server with Python 3.10+.

---

## Features

* Sends **random Psalm chapters** automatically.
* Verse numbers appear as **superscript**.
* Supports **group or private chat**.
* Works with **Python Telegram Bot v20+** (async API).

---

## Requirements

* Python 3.10+
* `python-telegram-bot` library (v20+)
* `BSB.json` file containing Bible text in JSON format.

---

## Installation

1. **Clone or download** the repository.
2. Install dependencies:

```bash
pip3.10 install --user python-telegram-bot
```

3. Upload `BSB.json` to the same folder as the script.

---

## Create a Telegram Bot (BotFather)

1. Open Telegram and search for `@BotFather`.
2. Start a chat and send `/newbot`.
3. Follow the instructions:

   * Give your bot a **name**.
   * Give your bot a **username** ending with `bot`.
4. BotFather will return a **token** (looks like `123456789:ABCdefGhIjklMNOpqr`).
5. Copy this token; it will be your `TOKEN` in the script.

---

## Get Chat ID

### **Private Chat**

1. Start a chat with your bot.
2. Send any message.
3. Run this script to get your chat ID:

```python
from telegram import Bot

TOKEN = "YOUR_BOT_TOKEN"
bot = Bot(token=TOKEN)

updates = bot.get_updates()
for u in updates:
    if u.message:
        print(u.message.chat.id)
```

* The printed number is your `CHAT_ID`.

### **Group Chat**

1. Add your bot to the group.
2. Send at least one message in the group.
3. Run the same script above.

* Group chat IDs are **negative numbers**.

---

## Configuration

Edit the script `psalm_bot.py`:

```python
TOKEN = "YOUR_BOT_TOKEN"
CHAT_ID = "YOUR_CHAT_ID"
```

---

## Running the Bot

Run manually:

```bash
python3.10 psalm_bot.py
```

Or schedule a daily task on PythonAnywhere:

```bash
python3.10 /home/yourusername/psalm_bot.py
```

---

## JSON Structure

The script expects `BSB.json` structured like:

```json
{
  "books": [
    {
      "name": "Psalms",
      "chapters": [
        {
          "chapter": 1,
          "name": "Psalm 1",
          "verses": [
            {"verse": 1, "text": "Blessed is the man..."},
            {"verse": 2, "text": "..."}
          ]
        }
      ]
    }
  ]
}
```

---

## Notes

* Works with **PythonAnywhere free tier**.
* Ensure at least one message is sent to the chat/group so the bot can access the `chat_id`.
* Superscript verse numbers use Unicode, compatible with Telegram messages.
* Async API is required for **python-telegram-bot v20+**.

---
