const db = require('../utils/database')
const { default: chalk } = require("chalk");

module.exports = (client) => {
  console.log(chalk.blue("0------------------| Database Handler:"));

  // AutoMod - Configurações
  db.prepare(`
  CREATE TABLE IF NOT EXISTS automod_settings (
    guild_id TEXT PRIMARY KEY,
    links_enabled INTEGER DEFAULT 0,
    spam_enabled INTEGER DEFAULT 0,
    caps_enabled INTEGER DEFAULT 0,
    mentions_limit INTEGER DEFAULT 5,
    emojis_limit INTEGER DEFAULT 10,
    length_limit INTEGER DEFAULT 1000
  )
`).run();


  // AutoMod - Autocargo
  db.prepare(`
      CREATE TABLE IF NOT EXISTS autorole (
        guild_id TEXT PRIMARY KEY,
        role_id TEXT
      )
  `).run();

  // AutoMod - Palavras Banidas
  db.prepare(`
    CREATE TABLE IF NOT EXISTS wordsblacklist (
      guild_id TEXT,
      word TEXT,
      PRIMARY KEY (guild_id, word)
    )
  `).run();

  // Avisos
  db.prepare(`
      CREATE TABLE IF NOT EXISTS warns (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        guild_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        moderator_id TEXT NOT NULL,
        reason TEXT NOT NULL,
        timestamp INTEGER NOT NULL
      )
  `).run();

  console.log(chalk.greenBright(`[AVISO - DATABASE] Database criado e ajustado com sucesso.` + "\n"));
}
