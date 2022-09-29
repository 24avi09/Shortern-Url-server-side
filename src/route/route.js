const express = require('express')
const router = express.Router()
const {createUrlShortner} = require('../controller/urlController')



router.post("/url/shorten", createUrlShortner )

module.exports = router

