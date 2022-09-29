const express = require('express')
const router = express.Router()
const {createUrlShortner, getUrl} = require('../controller/urlController')



router.post("/url/shorten", createUrlShortner )

router.get("/:urlCode", getUrl )

module.exports = router

