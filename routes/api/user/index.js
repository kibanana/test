const express = require('express')
const passport = require('passport')

const controller = require('./user.controller')
const router = express.Router()

router.use('*', passport.authenticate('jwt'))

router.patch('/password', controller.changeUserPassword)
router.patch('/nickname', controller.changeUserNickname)
router.patch('/info', controller.changeUserInfo)

module.exports = router
