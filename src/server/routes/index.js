const DataAccessObject = require('../dao').DataAccessObject
const ApiResponse = require('../dao').ApiResponse

const {
  router, path, jwt, bcrypt, saltRounds, SECRET
} = require('../config.js')

const dao = new DataAccessObject(path.resolve(__dirname, '../../../vault.db'), {
  migrations: ['./migrations/v1.0.js']
})

router.post('/auth', (_, res) => {
  return res.json(new ApiResponse('success'))
})

router.post('/signin', async (req, res) => {
  const uname = req.body.username
  const pword = req.body.password
  const error = new ApiResponse('error', {}, ['Invalid login information.'])

  const user = dao.get(`SELECT * FROM user WHERE name = ?`, uname)

  if (user.status === 'error') {
    return res.json(error)
  }

  const match = await bcrypt.compare(pword, user.data.password)
    .then(matched => matched).catch(() => false);

  if (match) {
    user.data = getUserDataWithToken(user.data.id)
    user.alerts.push(`Welcome back ${user.data.name}!`)

    return res.json(user)
  }

  return res.json(error)
})

router.post('/signup', async (req, res) => {
  const uname = req.body.username
  const pword = req.body.password
  const vPword = req.body.verify

  const error = new ApiResponse()

  if (pword !== vPword) {
    error.alerts = ['Verification password does not match original password.']
    return res.json(error)
  }

  if (checkExistingUser(uname)) {
    error.alerts = [`The user name '${uname}' is taken.`]
    return res.json(error)
  }

  const newUser = await createNewUser(uname, pword)
  newUser.data = getUserDataWithToken(newUser.data.lastInsertRowid)

  return res.json(newUser)
})

function getUserDataWithToken(userId) {
  const token = jwt.sign({ id: userId }, SECRET,
                         { algorithm: 'HS512', expiresIn: '3 hours' })

  const user = dao.get(`SELECT * FROM user WHERE id = ?`, userId)

  return { id: userId, name: user.data.name, token }
}

async function createNewUser(username, password) {
  return await bcrypt.hash(password, saltRounds).then(hash => {
    const newUser = dao.run(`INSERT INTO user (name, password)
                             VALUES (?, ?)`, [username, hash])

    if (newUser.status === 'error') {
      return newUser
    }

    newUser.alerts = ['Welcome to vault!']
    return newUser
  }).catch(err => console.log(err))
}

function checkExistingUser(uname) {
  const userExists = dao.get(`SELECT * FROM user WHERE name = ?`, uname)

  if (userExists.alerts[0] === 'No results.') {
    return null
  }

  userExists.alerts = ['User name not available.']
  return userExists
}

module.exports = router

