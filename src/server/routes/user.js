const sjcl = require('sjcl')

const DataAccessObject = require('../dao').DataAccessObject
const ApiResponse = require('../dao').ApiResponse

const { router, path, SECRET } = require('../config.js')

const vaultQuery = `SELECT vault.*, category.name AS cat_name FROM vault
                    JOIN category ON category.id = vault.category_id
                    JOIN user ON user.id = vault.user_id
                    WHERE user.id = ?`

const dao = new DataAccessObject(path.resolve(__dirname, '../../../vault.db'), {
  migrations: ['./migrations/v1.0.js']
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
  const data = req.body;


  return res;
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

