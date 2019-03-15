const Database = require('better-sqlite3')

class ApiResponse {
  constructor(status = 'error', data = {}, alerts = []) {
    this.status = status
    this.data = data
    this.alerts = alerts
  }

  success(data) {
    this.status = 'success'
    this.data = data
  }
}

class DataAccessObject {
  constructor(dbPath, options) {
    if (options && options.migrations) {
      this._runMigrations(options.migrations, dbPath)
    }

    this.db = new Database(dbPath)
    console.log(`Connected to database ${dbPath}`)
  }

  get(sql, params) {
    const response = new ApiResponse()

    try {
      const data = this.db.prepare(sql).get(params)

      response.success(data)

      if (!data) {
        response.data = {}
        response.alerts.push('No results.')
      }
    } catch (err) {
      console.log(err)
      response.data = err
    }

    return response
  }

  run(sql, params) {
    const response = new ApiResponse()

    try {
      const data = this.db.prepare(sql).run(params)

      response.success(data)
    } catch (err) {
      response.data = err
    }

    return response
  }

  _runMigrations(migrations, dbPath) {
    migrations.forEach(path => {
      require(path).up(dbPath)
    })
  }
}

module.exports = {
  DataAccessObject,
  ApiResponse
}

