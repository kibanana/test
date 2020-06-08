const Board = require('../../../model/board')

const message = require('../../../module/message')
const { FailedMessageObj } = require('../../../module/constants')
const { SuccessMessage, FailedMessage, InternalErrorMessage } = message

exports.createBoard = async (req, res) => {
  try {
    const { title, body } = req.body
    const userId = req.user._id
    if (!(userId && title && body)) {
      return res.status(400).send(new FailedMessage(FailedMessageObj.INVALID_PARAM))
    }
    const newBoard = await Board.createBoard({ userId, title, body })
    res.send(new SuccessMessage(newBoard))
    // res.send(new SuccessMessage())
  }
  catch (err) {
    res.status(500).send(new InternalErrorMessage())
  }
}

exports.findBoards = async (req, res) => {
  try {
    const { searchString } = req.body
    const boards = await Board.findBoards(searchString)
    res.send(new SuccessMessage(boards))
  }
  catch (err) {
    res.status(500).send(new InternalErrorMessage())
  }
}

exports.findBoard = async (req, res) => {
  try {
    const { id } = req.params
    if (!id) { 
      return res.status(400).send(new FailedMessage(FailedMessageObj.INVALID_PARAM))
    }
    const board = await Board.findBoard(id)
    if (!board) {
      return res.status(404).send(new FailedMessage(FailedMessageObj.NOT_EXIST))
    }
    res.send(new SuccessMessage(board))
  }
  catch (err) {
    res.status(500).send(new InternalErrorMessage())
  }
}

exports.changeBoard = async (req, res) => {
  try {
    const { id } = req.params
    const { title, body } = req.body
    const userId = req.user._id
    if (!(userId && id && title && body)) {
      return res.status(400).send(new FailedMessage(FailedMessageObj.INVALID_PARAM))
    }
    const result = await Board.changeBoard({ userId, id, title, body })
    if (result.n == 0) {
      return res.status(404).send(new FailedMessage(FailedMessageObj.NOT_EXIST))
    }
    res.send(new SuccessMessage())
  }
  catch (err) {
    res.status(500).send(new InternalErrorMessage())
  }
}

exports.deleteBoard = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user._id
    if (!(id && userId)) {
      return res.status(400).send(new FailedMessage(FailedMessageObj.INVALID_PARAM))
    }
    const result = await Board.deleteBoard(id, userId)
    if (result.n == 0) {
      return res.status(404).send(new FailedMessage(FailedMessageObj.NOT_EXIST))
    }
    res.send(new SuccessMessage())
  }
  catch (err) {
    res.status(500).send(new InternalErrorMessage())
  }
}
