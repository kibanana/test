const express = require('express')
const passport = require('passport')

const controller = require('./file.controller')

const router = express.Router()

router.get('/', controller.FindFiles)
router.get('/download/:id', controller.DownloadFile)

router.use('*', passport.authenticate('jwt'))

router.post('/upload', require('../../../middleware/upload'), controller.UploadFile)

module.exports = router
