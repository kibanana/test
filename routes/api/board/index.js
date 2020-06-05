const express = require('express')
const passport = require('passport')

const controller = require('./board.controller')

const router = express.Router()

router.get('/boards', controller.findBoards)
router.get('/board/:id', controller.findBoard)

router.use('*', passport.authenticate('jwt'))

router.post('/board', controller.createBoard)
router.patch('/board/:id', controller.changeBoard)
router.delete('/board/:id', controller.deleteBoard)

module.exports = router
