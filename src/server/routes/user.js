const sjcl = require('sjcl')

const { router, path, dao, ApiResponse, SECRET } = require('../config.js')

const vaultQuery = `SELECT vault.id, vault.product, vault.name,
                    vault.password, category.name AS category FROM vault
                    JOIN category ON category.id = vault.category_id
                    JOIN user ON user.id = vault.user_id
                    WHERE user.id = ?`

router.get('', (req, res) => {
  const response = dao.get(`SELECT * FROM user WHERE id = ?`, [req.auth.id])
  const jwt = req.headers.authorization.split(' ')[1]

  reEncode(response.data, jwt)

  return res.json(response)
})

router.get('/data', (req, res) => {
  const response = dao.all(vaultQuery, req.auth.id)
  const jwt = req.headers.authorization.split(' ')[1]

  reEncode(response.data, jwt)

  return res.json(response)
})

router.post('/item', (req, res) => {
  const data = req.body
  const catId = getCategoryId(data.category)
  const jwt = req.headers.authorization.split(' ')[1]

  const pword = JSON.stringify(
    sjcl.encrypt(
      SECRET, sjcl.decrypt(jwt, JSON.parse(data.password))
    )
  )

  const result = dao.run(`INSERT INTO vault (user_id, category_id, product,
                            name, password) VALUES (?, ?, ?, ?, ?)`,
                           [req.auth.id, catId, data.product, data.name, pword])

  if (result.status === 'success') {
    const response = dao.all(vaultQuery, req.auth.id)
    reEncode(response.data, jwt)

    return res.json(response)
  }

  return res.json(result)
})

router.put('/item', (req, res) => {
  const jwt = req.headers.authorization.split(' ')[1]
  const { body } = req

  console.log(body)

  const pword = JSON.stringify(
    sjcl.encrypt(
      SECRET, sjcl.decrypt(jwt, JSON.parse(body.password))
    )
  )

  const result = dao.run(`UPDATE vault
                          SET product = ?, name = ?, password = ?
                          WHERE id = ?`,
                          [body.product, body.name, pword, body.id])

  if (result.status === 'success') {
    const response = dao.all(vaultQuery, req.auth.id)
    reEncode(response.data, jwt)

    response.alerts = ['Credentials updated.']

    return res.json(response)
  }

  return res.json(result)
})

function reEncode(items, key) {
  items.forEach(item => {
    item.password = sjcl.encrypt(
      key, sjcl.decrypt(SECRET, JSON.parse(item.password))
    )
  })
}

function getCategoryId (category) {
  const categoryExists = dao.get(`SELECT * from category
                                  WHERE name = ?`, category)

  if (categoryExists.alerts[0] === 'No results.') {
    const newCategory = dao.run(`INSERT INTO category (name)
                                 VALUES(?)`, category)
    return newCategory.data.lastInsertRowid
  }

  return categoryExists.data.id
}

module.exports = router

