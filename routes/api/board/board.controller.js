const Board = require('../../../model/board')

const message = require('../../../module/message')
const { FailedMessageObj, OBJECT_ID_LENGTH } = require('../../../module/constants')
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
    console.log(err)
    res.status(500).send(new InternalErrorMessage())
  }
}

exports.findBoards = async (req, res) => {
  try {
    const { searchString, sortKey } = req.body
    const boards = await Board.findBoards(searchString, Number(sortKey))
    res.send(new SuccessMessage(boards))
  }
  catch (err) {
    console.log(err)
    res.status(500).send(new InternalErrorMessage())
  }
}

exports.findBoard = async (req, res) => {
  try {
    const { id } = req.params
    if (!id || id.length != OBJECT_ID_LENGTH) { 
      return res.status(400).send(new FailedMessage(FailedMessageObj.INVALID_PARAM))
    }
    const board = await Board.findBoard(id)
    if (!board) {
      return res.status(404).send(new FailedMessage(FailedMessageObj.NOT_EXIST))
    }
    res.send(new SuccessMessage(board))
  }
  catch (err) {
    console.log(err)
    res.status(500).send(new InternalErrorMessage())
  }
}

exports.changeBoard = async (req, res) => {
  try {
    const { id } = req.params
    const { title, body } = req.body
    const userId = req.user._id
    if (!(userId && id && title && body) || id.length != OBJECT_ID_LENGTH) {
      return res.status(400).send(new FailedMessage(FailedMessageObj.INVALID_PARAM))
    }
    const result = await Board.changeBoard({ userId, id, title, body })
    if (result.n == 0) {
      return res.status(404).send(new FailedMessage(FailedMessageObj.NOT_EXIST))
    }
    res.send(new SuccessMessage())
  }
  catch (err) {
    console.log(err)
    res.status(500).send(new InternalErrorMessage())
  }
}

exports.deleteBoard = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user._id
    if (!(id && userId) || id.length != OBJECT_ID_LENGTH) {
      return res.status(400).send(new FailedMessage(FailedMessageObj.INVALID_PARAM))
    }
    const result = await Board.deleteBoard(id, userId)
    if (result.n == 0) {
      return res.status(404).send(new FailedMessage(FailedMessageObj.NOT_EXIST))
    }
    res.send(new SuccessMessage())
  }
  catch (err) {
    console.log(err)
    res.status(500).send(new InternalErrorMessage())
  }
}

exports.likeBoard = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user._id
    if (!(id && userId) || id.length != OBJECT_ID_LENGTH) {
      return res.status(400).send(new FailedMessage(FailedMessageObj.INVALID_PARAM))
    }
    await Board.addLikeMember(id, userId)
    res.send(new SuccessMessage())
  }
  catch (err) {
    console.log(err)
    res.status(500).send(new InternalErrorMessage())
  }
}

exports.cancelLikeBoard = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user._id
    if (!(id && userId) || id.length != OBJECT_ID_LENGTH) {
      return res.status(400).send(new FailedMessage(FailedMessageObj.INVALID_PARAM))
    }
    await Board.removeLikeMember(id, userId)
    res.send(new SuccessMessage())
  }
  catch (err) {
    console.log(err)
    res.status(500).send(new InternalErrorMessage())
  }
}
