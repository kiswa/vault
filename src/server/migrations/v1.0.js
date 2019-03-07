const sqlite = require('sqlite3')

;(() => {
  let db = new sqlite.Database('./pword.db')

  db.run('PRAGMA foreign_keys = ON')

  db.serialize(() => {
    db.run(`CREATE TABLE user (
          id INTEGER PRIMARY KEY,
          name TEXT,
          password TEXT
        )`)

    db.run(`CREATE TABLE pword (
          id INTEGER PRIMARY KEY,
          user_id INTEGER,
          name TEXT,
          password TEXT,
          FOREIGN KEY(user_id) REFERENCES user(id)
        )`)
  })

  db.close()
})()
