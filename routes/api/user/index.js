const express = require('express')
const passport = require('passport')

const controller = require('./user.controller')
const router = express.Router()

router.post('/find-password', controller.EmailFindPassword)
router.get('/find-password', controller.ConfirmEmailFindPassword)
router.post('/new-password', controller.ConfirmNewPassword)

router.use('*', passport.authenticate('jwt'))

router.patch('/password', controller.ChangeUserPassword)
router.patch('/nickname', controller.ChangeUserNickname)
router.patch('/info', controller.ChangeUserInfo)

module.exports = router
