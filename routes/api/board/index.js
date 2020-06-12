const express = require('express')
const passport = require('passport')

const controller = require('./board.controller')

const router = express.Router()

router.get('/', controller.FindBoards)
router.get('/analysis', controller.AnalyzeBoard)
router.get('/:id', controller.FindBoard)

router.use('*', passport.authenticate('jwt'))

router.post('/', controller.CreateBoard)
router.patch('/:id', controller.UpdateBoard)
router.delete('/:id', controller.DeleteBoard)
router.post('/:id/like', controller.LikeBoard)
router.delete('/:id/like/cancel', controller.CancelLikeBoard)
router.post('/:id/report', controller.ReportBoard)

router.post('/:id/comment', controller.CreateComment)
router.patch('/:boardId/comment/:commentId', controller.UpdateComment)
router.delete('/:boardId/comment/:commentId', controller.DeleteComment)
router.post('/:boardId/comment/:commentId/report', controller.ReportComment)

module.exports = router
