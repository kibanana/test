const User = require('../../../model/user')

const { SuccessMessage, FailedMessage, InternalErrorMessage } = require('../../../module/message')

exports.changeUserPassword = async (req, res) => {
  try {
    const { oldPwd, newPwd } = req.body
    if (!(oldPwd && newPwd)) {
      return res.status(400).send(new FailedMessage('ERR_INVALID_PARAM', '필수 파라미터가 전달되지 않았습니다.'))
    }
    const user = await User.findPasswordById(req.user._id)
    if (!user.verify(oldPwd)) {
      return res.status(400).send(new FailedMessage('ERR_INVALID_PWD', '기존 비밀번호가 틀렸습니다'))
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
      return res.status(400).send(new FailedMessage('ERR_INVALID_PARAM', '필수 파라미터가 전달되지 않았습니다.'))
    }
    if (await User.chkExistsNickname(req.user._id, nickname)) {
      return res.status(400).send(new FailedMessage('ERR_EXISTS_NICKNAME', '다른 사용자의 닉네임입니다'))
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
      return res.status(400).send(new FailedMessage('ERR_INVALID_PARAM', '필수 파라미터가 전달되지 않았습니다.'))
    }
    await User.changeUserInfo({ id: req.user._id, address, birthDay })
    res.send(new SuccessMessage())
  }
  catch (err) {
    res.status(500).send(new InternalErrorMessage())
  }  
}
