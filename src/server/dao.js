const sqlite = require('sqlite3').verbose()

class DataAccessObject {

  constructor(dbPath, options) {
    if (options && options.migrations) {
      this.runMigrations(options.migrations)
    }

    this.db = new sqlite.Database(dbPath, err => {
      if (err) {
        return console.error(err.message)
      }

      console.log(`Connected to database ${dbPath}`)
    })
  }

  runMigrations(migrations) {
    migrations.forEach(path => {
      require(path)
    })
  }
}

module.exports = DataAccessObject

