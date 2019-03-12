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
                            AND name='pword'`).get()

    if (!tbl) {
      console.info('Creating table "pword"...')
      db.prepare(`CREATE TABLE pword (
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  user_id INTEGER,
                  product TEXT,
                  name TEXT,
                  password TEXT,
                  FOREIGN KEY(user_id) REFERENCES user(id)
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
  db.prepare(`DROP TABLE pword`).run()

  db.close()
}

module.exports = {
  up,
  down
}

