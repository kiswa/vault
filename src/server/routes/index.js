const express = require('express')
const router = express.Router()
const path = require('path')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const saltRounds = 13

const DataAccessObject = require('../dao').DataAccessObject
const ApiResponse = require('../dao').ApiResponse

const dao = new DataAccessObject(path.resolve(__dirname, '../../../pword.db'), {
  migrations: ['./migrations/v1.0.js'] // Assumes this is run from project root.
})

router.post('/login', async (req, res) => {
  const uname = req.body.username
  const pword = req.body.password
  const error = new ApiResponse('error', {}, ['Invalid login information.'])

  const user = dao.get(`SELECT * FROM user WHERE name = ?`, uname)

  if (user.status === 'error') {
    return res.json(error)
  }

  const match = bcrypt.compareSync(pword, user.data.password)

  return res.json(match ? user : error)
})

router.post('/signup', async (req, res) => {
  const uname = req.body.username
  const pword = req.body.password
  const vPword = req.body.verify

  if (pword !== vPword) {
    return res.json(new ApiResponse('error', {},
     ['Verification password does not match original password.']))
  }

  if (checkExistingUser(uname)) {
    exists.status = 'error'
    exists.data = {}
    return res.json(exists)
  }

  return res.json(await createNewUser(uname, pword))
})

async function createNewUser(username, password) {
  return await bcrypt.hash(password, saltRounds).then(hash => {
    const newUser = dao.run(`INSERT INTO user (name, password)
                             VALUES (?, ?)`, [username, hash])
    console.log(`newUser: ${JSON.stringify(newUser)}`)

    if (newUser.status === 'error') {
      return newUser
    }

    newUser.alerts = ['New user created successfully.']
    return newUser
  }).catch(err => console.log(err))
}

function checkExistingUser(uname) {
  const userExists = dao.get(`SELECT * FROM user WHERE name = ?`, uname)

  console.log(userExists)
  if (userExists.status === 'error') {
    return null
  }

  userExists.alerts = ['User name already in use.']
  return userExists
}

module.exports = router

