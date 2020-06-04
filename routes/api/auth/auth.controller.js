const User = require('../../../model/user')
const message = require('../../../module/message')

const { SuccessMessage, FailedMessage, InternalErrorMessage } = message

exports.SignUp = async (req, res) => {
  try {
    const { email, password, name } = req.body
    if (await User.chkExistsEmail(email)) return res.status(400).send(new FailedMessage('ERR_EXIST_EMAIL', '중복된 이메일입니다. 이미 가입된 계정으로 로그인 해주세요.'))
    await User.signUp(email, password, name)
    res.send(new SuccessMessage())
  } 
  catch (err) {
    console.log(err)
    res.status(500).send(new InternalErrorMessage())
  }
}

exports.SignIn = (req, res) => {
  try {
    if (req.user.err) throw new Error(req.user.err)

    const token = ''

    res.send(new SuccessMessage({ token }))
  } 
  catch (err) {
    console.log(err)
    res.status(500).send(new InternalErrorMessage())
  }
}

exports.SignInFailed = (req, res) => {
  res.status(400).send(new FailedMessage('ERR_INVALID_EMAIL_PWD', '이메일이나 비밀번호가 틀렸습니다'))
}
