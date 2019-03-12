const sqlite = require('sqlite3').verbose()

class ApiResponse {
  constructor(status = 'error', data = {}, alerts = []) {
    this.status = status
    this.data = data
    this.alerts = alerts
  }
}

class DataAccessObject {

  constructor(dbPath, options) {
    if (options && options.migrations) {
      this._runMigrations(options.migrations)
    }

    this.db = new sqlite.Database(dbPath, err => {
      if (err) {
        return console.error(err.message)
      }

      console.log(`Connected to database ${dbPath}`)
    })
  }

  async get(sql, params) {
    const get = await new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err)
        }

        resolve(row)
      })
    }).then(res => new ApiResponse('success', res))
      .catch(err => new ApiResponse('error', err))

    return get
  }

  async run(sql, params) {
    const run = await new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err)
        }

        resolve(true)
      })
    }).then (res => new ApiResponse('success', res))
      .catch(err => new ApiResponse('error', err))

    return run
  }

  _runMigrations(migrations) {
    migrations.forEach(path => {
      require(path).up()
    })
  }
}

module.exports = {
  DataAccessObject,
  ApiResponse
}

