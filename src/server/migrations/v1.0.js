const Database = require('better-sqlite3')

function up(dbPath) {
  let db = new Database(dbPath)
  db.pragma('foreign_keys = ON')

  try {
    const tbl = db.prepare(`SELECT name FROM sqlite_master
                            WHERE type='table'
                            AND name='user'`).get()

    if (!tbl) {
      console.info('Creating table "user"...')
      db.prepare(`CREATE TABLE user (
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  name TEXT,
                  password TEXT
                  )`).run()
    }
  } catch(err) {
    console.error(err)
  }

  try {
    const tbl = db.prepare(`SELECT name FROM sqlite_master
                            WHERE type='table'
                            AND name='category'`).get()

    if (!tbl) {
      console.info('Creating table "category"...')
      db.prepare(`CREATE TABLE category (
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  name TEXT
                  )`).run()
    }
  } catch(err) {
    console.error(err)
  }

  try {
    const tbl = db.prepare(`SELECT name FROM sqlite_master
                            WHERE type='table'
                            AND name='vault'`).get()

    if (!tbl) {
      console.info('Creating table "vault"...')
      db.prepare(`CREATE TABLE vault (
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  user_id INTEGER,
                  category_id INTEGER,
                  active INTEGER DEFAULT 1,
                  product TEXT,
                  name TEXT,
                  password TEXT,
                  FOREIGN KEY(user_id) REFERENCES user(id),
                  FOREIGN KEY(category_id) REFERENCES category(id)
                  )`).run()
    }
  } catch(err) {
    console.error(err)
  }

  db.close()
}

function down(dbPath) {
  let db = new Database(dbPath)

  db.prepare(`DROP TABLE user`).run()
  db.prepare(`DROP TABLE category`).run()
  db.prepare(`DROP TABLE vault`).run()

  db.close()
}

module.exports = {
  up,
  down
}

