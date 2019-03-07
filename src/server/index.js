const express = require('express')
const bodyParser = require('body-parser')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const PORT = process.env.PORT || 3128
const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('No endpoint here.')
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

