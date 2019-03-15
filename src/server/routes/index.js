const express = require('express')
const router = express.Router()
const path = require('path')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const saltRounds = 13
const SECRET = process.env.SECRET || 'super secret key thing - change this'

const DataAccessObject = require('../dao').DataAccessObject
const ApiResponse = require('../dao').ApiResponse

const dao = new DataAccessObject(path.resolve(__dirname, '../../../pword.db'), {
  migrations: ['./migrations/v1.0.js']
})

router.post('/auth', (req, res) => {
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

  const match = bcrypt.compareSync(pword, user.data.password)

  if (match) {
    user.data = getUserDataWithToken(user.data.id)
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

router.get('/data', (req, res) => {
  const data = dao.get(`SELECT * FROM vault
                        JOIN category ON category.id = vault.category_id
                        JOIN user ON user.id = vault.user_id
                        WHERE user.id = ?`, req.auth.id)

  return res.json(data)
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

    newUser.alerts = ['New user created successfully.']
    return newUser
  }).catch(err => console.log(err))
}

function checkExistingUser(uname) {
  const userExists = dao.get(`SELECT * FROM user WHERE name = ?`, uname)

  if (userExists.status === 'error') {
    return null
  }

  userExists.alerts = ['User name already in use.']
  return userExists
}

module.exports = router

