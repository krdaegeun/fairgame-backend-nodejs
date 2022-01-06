const Router = require('express')
const router = new Router()
const controller = require('./controller')

router.post('/state', controller.state)
router.post('/username', controller.username)
router.post('/password', controller.password)


module.exports = router;
