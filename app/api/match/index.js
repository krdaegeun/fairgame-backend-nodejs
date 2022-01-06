const Router = require('express')
const router = new Router()
const controller = require('./controller')

/**
 * TEST 27.5.2019
 * NAME ROUTER FOR SEARCH CONTROLLER
 */
router.get('/team', controller.createTeam)
router.post('/add', controller.add)
router.get('/list', controller.list)
router.get('', controller.load)
router.post('/feedback/set', controller.setFeedback)

module.exports = router;
