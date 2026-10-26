const ESV_URL = "https://api.esv.org/v3/passage/text/";
const TELEGRAM_LIMIT = 4096;
const PSALM_COUNT = 150;

// Superscript mapping
const SUPERSCRIPT = "⁰¹²³⁴⁵⁶⁷⁸⁹";
const toSuperscript = (n) => [...String(n)].map((d) => SUPERSCRIPT[d]).join("");

async function fetchPsalm(chapter, apiKey) {
  const params = new URLSearchParams({
    q: `Psalm ${chapter}`,
    "include-passage-references": "false",
    "include-verse-numbers": "true",
    "include-first-verse-numbers": "true",
    "include-footnotes": "false",
    "include-headings": "false",
    "include-short-copyright": "true",
    "indent-paragraphs": "0",
    "indent-poetry": "false",
  });
  const res = await fetch(`${ESV_URL}?${params}`, {
    headers: { Authorization: `Token ${apiKey}` },
  });
  if (!res.ok) throw new Error(`ESV API ${res.status}: ${await res.text()}`);

  const data = await res.json();
  const text = data.passages?.[0];
  if (!text) throw new Error(`ESV API returned no passage for Psalm ${chapter}`);

  // "[12] " -> "¹² "
  return text.replace(/\[(\d+)\]\s*/g, (_, n) => `${toSuperscript(n)} `).trim();
}

// Split on line breaks so each message stays under Telegram's limit (Psalm 119).
function chunk(text, limit = TELEGRAM_LIMIT) {
  const parts = [];
  let current = "";
  for (const line of text.split("\n")) {
    if (current && current.length + line.length + 1 > limit) {
      parts.push(current);
      current = "";
    }
    current = current ? `${current}\n${line}` : line;
  }
  if (current) parts.push(current);
  return parts;
}

async function sendMessage(env, text) {
  const res = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: env.CHAT_ID, text }),
  });
  if (!res.ok) throw new Error(`Telegram ${res.status}: ${await res.text()}`);
}

async function sendRandomPsalm(env) {
  for (const name of ["TELEGRAM_TOKEN", "CHAT_ID", "ESV_API_KEY"]) {
    if (!env[name]) throw new Error(`Missing secret ${name}`);
  }
  const chapter = Math.floor(Math.random() * PSALM_COUNT) + 1;
  const psalm = await fetchPsalm(chapter, env.ESV_API_KEY);
  for (const part of chunk(`Psalm ${chapter}:\n${psalm}`)) {
    await sendMessage(env, part);
  }
}

export default {
  // Errors are thrown so the run shows as failed in the Cloudflare dashboard.
  async scheduled(event, env, ctx) {
    await sendRandomPsalm(env);
  },
};
