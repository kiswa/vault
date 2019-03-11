const express = require('express')
const router = express.Router()

const jwt = require('jsonwebtoken')

const DataAccessObject = require('../dao')
const dao = new DataAccessObject('../pword.db', {
  migrations: ['./migrations/v1.0.js'] // Assumes this is run from project root.
})

router.get('/', (req, res) => {
  res.json({
    status: 'error',
    data: {},
    alerts: ['Invalid Enpdoint']
  })
})

router.post('/login', async (req, res) => {
  const uname = req.body.username
  const pword = req.body.password

  const result = await dao.getAsync(`SELECT * FROM user WHERE name=?`, uname)

  return res.json(result)
})

router.post('/signup', async (req, res) => {
  const uname = req.body.username
  const pword = req.body.password
  const vPword = req.body.verify

  if (pword !== vPword) {
    return res.json({
      status: 'error',
      data: {},
      alerts: ['Verification password does not match original password.']
    })
  }

  const userCheck = await dao.get(`SELECT * FROM user WHERE name=?`, uname)

  if (userCheck.status === 'success') {
    return res.json({
      status: 'error',
      data: {},
      alerts: ['User name already in use.']
    })
  }

  const newUser = await dao.run(`INERT INTO user (name, password)
    VALUES (?, ?)`, username, )
})

module.exports = router

