const Router = require('express')
const router = new Router()
const controller = require('./controller')

router.get('/autocomplete', controller.autocomplete)
router.get('', controller.user)
router.get('/ranking', controller.ranking)
router.get('/ranking/me', controller.mRanking)
router.get('/ranking/state', controller.state)

module.exports = router;
