const Router = require('express')
const router = new Router()

// For login and register
const auth = require('./auth')

// For search players in DB
const search = require('./search')

// For making team
const match = require('./match')

const setting = require("./setting")

router.use('/auth', auth)
router.use('/search', search)
router.use('/match', match)
router.use('/setting', setting)

module.exports = router;