const { express, SECRET } = require('./config.js')

const util = require('util')
const bodyParser = require('body-parser')
const compression = require('compression')
const jwtMiddleware = require('express-jwt')

const PORT = process.env.PORT || 3128
const app = express()

const routes = require('./routes/index')
const userRoutes = require('./routes/user')

app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers",
             "Origin, X-Requested-With, Content-Type, Accept, Authorization")
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")

  next()
})


app.use(jwtMiddleware({
  secret: SECRET,
  requestProperty: 'auth'
}).unless({ path: ['/signin', '/signup'] }))

app.use((err, _, res, __) => {
  const errObj = {
    status: 'error',
    data: (app.get('env') === 'development') ? err : {},
    alerts: ['Token is invalid or expired. Please sign in again.']
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json(errObj)
  }

  errObj.alerts = [err.message]
  return res.status(err.status || 500).json(errObj)
})
app.use(bodyParser.json())
app.use(compression())

app.use('/', routes)
app.use('/user/', userRoutes)

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
