const path = require('path')
const User = require('../../../model/user')
const Code = require('../../../model/code')
const { sendFindPasswordEmail } = require('../../../module/nodemailer')
const { FailedMessageObj } = require('../../../module/constants')

const { SuccessMessage, FailedMessage, InternalErrorMessage } = require('../../../module/message')

exports.ChangeUserPassword = async (req, res) => {
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
    console.log(err)
    res.status(500).send(new InternalErrorMessage())
  }
}

exports.ChangeUserNickname = async (req, res) => {
  try {
    const { nickname } = req.body
    if (!nickname) {
      return res.status(400).send(new FailedMessage(FailedMessageObj.INVALID_PARAM))
    }
    if (await User.chkExistsNickname(nickname, req.user._id)) {
      return res.status(400).send(new FailedMessage(FailedMessageObj.EXIST_NICKNAME))
    }
    await User.changeUserNickname(req.user._id, nickname)
    res.send(new SuccessMessage())
  }
  catch (err) {
    console.log(err)
    res.status(500).send(new InternalErrorMessage())
  }  
}

exports.ChangeUserInfo = async (req, res) => {
  try {
    const { address, birthDay } = req.body
    if (!address && !birthDay) {
      return res.status(400).send(new FailedMessage(FailedMessageObj.INVALID_PARAM))
    }
    await User.changeUserInfo({ id: req.user._id, address, birthDay })
    res.send(new SuccessMessage())
  }
  catch (err) {
    console.log(err)
    res.status(500).send(new InternalErrorMessage())
  }  
}

exports.EmailFindPassword = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) {
      return res.status(400).send(new FailedMessage(FailedMessageObj.INVALID_PARAM))
    }
    const { _id: userId } = await User.findByEmail(email)
    const code = await Code.registerPasswordCode(userId)
    await sendFindPasswordEmail(email, code)
    res.send(new SuccessMessage())
  }
  catch (err) {
    console.log(err)
    res.status(500).send(new InternalErrorMessage())
  }
}

exports.ConfirmEmailFindPassword = async (req, res) => {
  try {
    const { code } = req.query
    if (!code) {
      return res.status(400).send(new FailedMessage(FailedMessageObj.INVALID_PARAM))
    }
    if (!(await Code.findPasswordCode(code))) { // DB에 해당 코드값이 없으면
      res.status(400).send(new FailedMessage(FailedMessageObj.INVALID_PARAM))
    } else {
      res.sendFile('view/newPasswordForm.html', { root: path.join(__dirname, '..', '..', '..') }) // html - 새 비밀번호 입력 폼 전송
    }
  }
  catch (err) {
    console.log(err)
    res.status(500).send(new InternalErrorMessage())
  }
}

exports.ConfirmNewPassword = async (req, res) => {
  try {
    const { code } = req.query
    const { newPassword } = req.body
    if (!(code && newPassword)) {
      return res.status(400).send(new FailedMessage(FailedMessageObj.INVALID_PARAM))
    }
    const { userId } = await Code.findUserIdByPasswordCode(code)
    await User.changeUserPassword(userId, newPassword)
    await Code.deletePasswordCode(userId)
    res.send(new SuccessMessage())
  }
  catch (err) {
    console.log(err)
    res.status(500).send(new InternalErrorMessage())
  }
}
