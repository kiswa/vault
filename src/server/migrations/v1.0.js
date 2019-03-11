const sqlite = require('sqlite3')

function up() {
  let db = new sqlite.Database('./pword.db')

  db.run('PRAGMA foreign_keys = ON')

  db.serialize(() => {
    db.get(`SELECT name FROM sqlite_master
            WHERE type='table'
            AND name='user'`,
      (err, res) => {
        if (err) {
          console.error(err)
          return
        }

        if (!res) {
          console.info(`Creating table 'user'...`)
        }
      })

    db.run(`CREATE TABLE IF NOT EXISTS user (
            id INTEGER PRIMARY KEY,
            name TEXT,
            password TEXT
            )`,
      (err, ret) => {
        if (err) {
          console.error(err)
        }
      })

    db.get(`SELECT name FROM sqlite_master
            WHERE type='table'
            AND name='pword'`,
      (err, res) => {
        if (err) {
          console.error(err)
          return
        }

        if (!res) {
          console.info(`Creating table 'pword'...`)
        }
      })

    db.run(`CREATE TABLE IF NOT EXISTS pword (
            id INTEGER PRIMARY KEY,
            user_id INTEGER,
            product TEXT,
            name TEXT,
            password TEXT,
            FOREIGN KEY(user_id) REFERENCES user(id)
            )`,
      (err, ret) => {
        if (err) {
          console.error(err)
        }
      })
  })

  db.close()
}

function down() {
  let db = new sqlite.Database('./pword.db')

  db.serialize(() => {
    db.run(`DROP TABLE IF EXISTS user`)
    db.run(`DROP TABLE IF EXISTS pword`)
  })
}

module.exports = {
  up,
  down
}

