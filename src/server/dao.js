const sqlite = require('sqlite3').verbose()

class DataAccessObject {
  constructor(dbPath) {
    this.db = new sqlite3.Database(dbPath, err => {
      if (err) {
        return console.error(err.message)
      }

      console.log(`Connected to database ${dbPath}`)
    })
  }
}

module.exports = DataAccessObject

