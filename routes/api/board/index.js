const express = require('express')
const passport = require('passport')

const controller = require('./board.controller')

const router = express.Router()

router.get('/boards', controller.FindBoards)
router.get('/board/:id', controller.FindBoard)

router.use('*', passport.authenticate('jwt'))

router.post('/board', controller.CreateBoard)
router.patch('/board/:id', controller.UpdateBoard)
router.delete('/board/:id', controller.DeleteBoard)
router.post('/board/:id/like', controller.LikeBoard)
router.delete('/board/:id/like/cancel', controller.CancelLikeBoard)
router.post('/board/:id/report', controller.ReportBoard)

module.exports = router
