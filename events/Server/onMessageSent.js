const { Events } = require("discord.js");
const client = require("../../yuki");
const db = require("../../utils/database");

module.exports = {
  name: 'onMessageSent',
};

client.on(Events.MessageCreate, async (message) => {
  AutoMod_Handler(message);
});

// ----------- Gerencia o AutoMod -----------
const AutoMod_Handler = async (message) => {
  if (!message.guild) return; // ignora DM's
  if (message.author.bot) return; // ignora bots
  if (message.member.permissions.has("ManageMessages")) return; // ignore staff/adms

  const { content, guildId, author, channel } = message;
  const msgContent = content.toLowerCase();

  // ----------- 1. Blacklist -----------
  const bannedWordsQuery = db.prepare(
    `SELECT word FROM wordsblacklist WHERE guild_id = ?`
  ).all(guildId);
  const bannedWords = bannedWordsQuery.map(r => r.word.toLowerCase());

  for (const word of bannedWords) {
    const regex = new RegExp(`(^|\\W)${escapeRegex(word)}(\\W|$)`, "i");
    if (regex.test(msgContent)) {
      await handleViolation(message, `Você usou uma palavra banida: **${word}**`);
      return;
    }
  }

  // ----------- 2. Carrega as configurações -----------
  const settings = db.prepare(
    `SELECT * FROM automod_settings WHERE guild_id = ?`
  ).get(guildId) || {};

  // ----------- 3. Links / convites -----------
  if (settings.links_enabled) {
    const linkRegex = /(https?:\/\/[^\s]+|discord\.gg\/[^\s]+)/i;
    if (linkRegex.test(content)) {
      await handleViolation(message, "Envio de links proibidos detectado!");
      return;
    }
  }

  // ----------- 4. Caps Lock -----------
  if (settings.caps_enabled) {
    const letters = content.replace(/[^a-zA-Z]/g, "");
    if (letters.length >= 5) { // Only consider messages with 5 letters or more.
      const capsPercent = letters.replace(/[A-Z]/g, "").length / letters.length;
      if (capsPercent < 0.3) { // More than 70% uppercase
        await handleViolation(message, "Uso excessivo de letras maiúsculas!");
        return;
      }
    }
  }

  // ----------- 5. Menções -----------
  if (settings.mentions_limit) {
    if (message.mentions.users.size > settings.mentions_limit) {
      await handleViolation(message, `Mensagem com muitas menções (limite: ${settings.mentions_limit})`);
      return;
    }
  }

  // ----------- 6. Emojis -----------
  if (settings.emojis_limit) {
    const emojiMatches = content.match(/<a?:\w+:\d+>|[\u{1F300}-\u{1FAFF}]/gu);
    const emojiCount = emojiMatches ? emojiMatches.length : 0;
    if (emojiCount > settings.emojis_limit) {
      await handleViolation(message, `Mensagem com muitos emojis (limite: ${settings.emojis_limit})`);
      return;
    }
  }

  // ----------- 7. Mensagens longas  -----------
  if (settings.length_limit) {
    if (content.length > settings.length_limit) {
      await handleViolation(message, `Mensagem muito longa (limite: ${settings.length_limit} caracteres)`);
      return;
    }
  }
};

// ----------- Função para quando há uma violação -----------
async function handleViolation(message, reason) {
  const { author, channel } = message;
  try {
    await message.delete();
    await channel.send({
      content: `${author}, sua mensagem foi removida! ⚠️ Motivo: ${reason}`
    }).then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
  } catch (err) {
    console.error("Erro ao aplicar automod:", err.message);
  }
}

// ----------- Escape Regex -----------
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
