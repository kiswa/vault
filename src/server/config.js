const express = require('express')
const router = express.Router()
const path = require('path')

const { ApiResponse, DataAccessObject } = require('./dao')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const saltRounds = 13
const SECRET = process.env.SECRET || 'super secret key thing - change this'

const dao = new DataAccessObject(path.resolve(__dirname, '../../vault.db'), {
  migrations: ['./migrations/v1.0.js']
})

module.exports = {
  express,
  router,
  path,
  dao,
  ApiResponse,
  jwt,
  bcrypt,
  saltRounds,
  SECRET
}

