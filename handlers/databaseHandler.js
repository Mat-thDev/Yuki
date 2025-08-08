const db = require('../utils/database')
const { default: chalk } = require("chalk");

module.exports = (client) => {
  console.log(chalk.blue("0------------------| Database Handler:"));

  // Autorole 
  db.prepare(`
      CREATE TABLE IF NOT EXISTS autorole (
        guild_id TEXT PRIMARY KEY,
        role_id TEXT
      )
  `).run();

  // Warns
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