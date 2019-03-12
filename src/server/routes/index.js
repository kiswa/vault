const express = require('express')
const router = express.Router()

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const saltRounds = 13

const DataAccessObject = require('../dao').DataAccessObject
const ApiResponse = require('../dao').ApiResponse

const dao = new DataAccessObject('../pword.db', {
  migrations: ['./migrations/v1.0.js'] // Assumes this is run from project root.
})

router.get('/', (_, res) => {
  res.json(new ApiResponse('error', {}, ['Invalid Enpdoint']))
})

router.post('/login', async (req, res) => {
  const uname = req.body.username
  const pword = req.body.password

  const result = await dao.get(`SELECT * FROM user WHERE name=?`, uname)

  // TODO: Verify password

  return res.json(result)
})

router.post('/signup', async (req, res) => {
  const uname = req.body.username
  const pword = req.body.password
  const vPword = req.body.verify

  if (pword !== vPword) {
    return res.json(new ApiResponse('error', {},
     ['Verification password does not match original password.']))
  }

  const exists = await checkExistingUser(uname)

  if (exists) {
    return exists
  }

  return res.json(createNewUser(uname, pword))
})

function createNewUser(username, password) {
  const error = {
    status: 'error',
    data: {},
    alerts: ['Error creating new user.']
  }

  return bcrypt.hash(password, saltRounds, async (err, hash) => {
    if (err) {
      error.data = err
      return error
    }

    const newUser = await dao.run(`INSERT INTO user (name, password)
      VALUES (?, ?)`, { username, hash })
    
    if (newUser.status === 'error') {
      return error
    }

    return new ApiResponse('success', newUser.data,
      ['New user created successfully.'])
  })
}

async function checkExistingUser(uname) {
  const userExists = await dao.get(`SELECT * FROM user WHERE name=?`, uname)

  if (userExists.status === 'error') {
    return
  }

  return res.json(new ApiResponse('error', {}, ['User name already in use.']))
}

module.exports = router
