const express = require('express')

const controller = require('./font.controller')

const router = express.Router()

router.post('/upload', require('../../../middleware/upload'), controller.UploadFont)

router.get('/', controller.FindFonts)

module.exports = router
