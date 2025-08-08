const Database = require('better-sqlite3');

const db = new Database('./data/yukiDB.db');

module.exports = db;