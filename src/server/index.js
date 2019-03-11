const express = require('express')
const bodyParser = require('body-parser')
const compression = require('compression')
const jwtMiddleware = require('express-jwt')

const PORT = process.env.PORT || 3128
const app = express()

const routes = require('./routes/index')

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers",
             "Origin, X-Requested-With, Content-Type, Accept, Authorization")
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")

  next()
})

app.use(bodyParser.json())
app.use(compression())
app.use(
  jwtMiddleware({ secret: 'super secret key thing - change this' })
    .unless({ path: ['/login'] })
)

app.use('/', routes)

app.use((req, res, next) => {
  const err = new Error('Invalid Endpoint')
  err.status = 404

  next(err)
})

app.use((err, req, res, next) => {
  const errObj = {
    message: 'Invalid token',
    error: (app.get('env') === 'development') ? err : {}
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json(errObj)
  }

  errObj.message = err.message
  return res.status(err.status || 500).json(errObj)
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})

