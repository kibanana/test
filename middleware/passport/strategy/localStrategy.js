const LocalStrategy = require('passport-local').Strategy
const User = require('../../../model/user')

module.exports = new LocalStrategy( // passport의 local strategy 등록
    {
      usernameField: 'email',
      passwordField: 'password',
    }, 
    async function (email, password, done) { // 에러, 계정 없음, 비밀번호 틀림, 로그인 성공
      try {
        const user = await User.signIn(email)
        if (!user) { // 이메일 -> X
          return done(null, false)
        }
        if (await user.verify(password)) { // 이메일 + 비밀번호 -> O
          done(null, user)
        }
        else done(null, false)
      }
      catch (err) {
        done(null, { err })
      }
    })
