const DataAccessObject = require('../dao').DataAccessObject
const ApiResponse = require('../dao').ApiResponse

const { router, path } = require('../config.js')

const dao = new DataAccessObject(path.resolve(__dirname, '../../../vault.db'), {
  migrations: ['./migrations/v1.0.js']
})

router.get('/data', (req, res) => {
  const data = dao.get(`SELECT * FROM vault
                        JOIN category ON category.id = vault.category_id
                        JOIN user ON user.id = vault.user_id
                        WHERE user.id = ?`, req.auth.id)

  return res.json(data)
})

router.post('/item', (req, res) => {
  const data = req.body;

  console.log(JSON.parse(data.password));

  return res;
})

router.put('/item', (req, res) => {
  const data = req.body;

  console.log(data);

  return res;
})

module.exports = router

