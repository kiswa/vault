const express = require('express')
const router = express.Router()

const jwt = require('jsonwebtoken')

const DataAccessObject = require('../dao')
const dao = new DataAccessObject('../pword.db', {
  migrations: ['./migrations/v1.0.js']
})

router.get('/', (req, res) => {
  res.json({
    message: 'Nothing to see here'
  })
})

router.post('/login', (req, res) => {
  console.log(req.body)
})

module.exports = router

