const jwt = require('jsonwebtoken')

const User = require('../../../model/user')
const message = require('../../../module/message')
const { TOKEN_KEY, TOKEN_OPTIONS } = require('../../../config')

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

    const token = jwt.sign({ _id: req.user._id }, TOKEN_KEY, TOKEN_OPTIONS)
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

// 토큰이 정상적으로 발급되고 유지됐는지 검사한다.
// passport-jwt을 도입함으로써 JwtVeirfy는 성공 메세지 날려주는 역할만 하게 됐다.
exports.JwtVerify = (req, res) => {
  res.send(new SuccessMessage())
}
