const express = require('express')
const router = express.Router()
const path = require('path')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const saltRounds = 13
const SECRET = process.env.SECRET || 'super secret key thing - change this'

module.exports = {
  express,
  router,
  path,
  jwt,
  bcrypt,
  saltRounds,
  SECRET
}

