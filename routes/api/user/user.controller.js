const User = require('../../../model/user')
const { FailedMessageObj } = require('../../../module/constants')

const { SuccessMessage, FailedMessage, InternalErrorMessage } = require('../../../module/message')

exports.changeUserPassword = async (req, res) => {
  try {
    const { oldPwd, newPwd } = req.body
    if (!(oldPwd && newPwd)) {
      return res.status(400).send(new FailedMessage(FailedMessageObj.INVALID_PARAM))
    }
    const user = await User.findPasswordById(req.user._id)
    if (!user.verify(oldPwd)) {
      return res.status(400).send(new FailedMessage(FailedMessageObj.INVAILD_PWD))
    }
    user.password = newPwd
    user.save()
    res.send(new SuccessMessage())
  }
  catch (err) {
    res.status(500).send(new InternalErrorMessage())
  }
}

exports.changeUserNickname = async (req, res) => {
  try {
    const { nickname } = req.body
    if (!nickname) {
      return res.status(400).send(new FailedMessage(FailedMessageObj.INVALID_PARAM))
    }
    if (await User.chkExistsNickname(req.user._id, nickname)) {
      return res.status(400).send(new FailedMessage(FailedMessageObj.EXIST_NICKNAME))
    }
    await User.changeUserNickname(req.user._id, nickname)
    res.send(new SuccessMessage())
  }
  catch (err) {
    res.status(500).send(new InternalErrorMessage())
  }  
}

exports.changeUserInfo = async (req, res) => {
  try {
    const { address, birthDay } = req.body
    if (!address && !birthDay) {
      return res.status(400).send(new FailedMessage(FailedMessageObj.INVALID_PARAM))
    }
    await User.changeUserInfo({ id: req.user._id, address, birthDay })
    res.send(new SuccessMessage())
  }
  catch (err) {
    res.status(500).send(new InternalErrorMessage())
  }  
}

