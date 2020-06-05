const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const User = require('../../../model/user')
const { TOKEN_KEY, TOKEN_OPTIONS } = require('../../../config')

const options = { }
options['jwtFromRequest'] = ExtractJwt.fromAuthHeaderAsBearerToken()
options['secretOrKey'] = TOKEN_KEY
options['issuer'] = TOKEN_OPTIONS.issuer

// JWT를 사용한 인가가 필요한 곳에 미들웨어로 끼워넣기
// JWT에 담긴 _id가 DB에 실제로 존재하는가?
module.exports = new JwtStrategy(options,
  async function (jwtPayload, done){
    try {
      const user = await User.findById(jwtPayload._id)
      if (!user) {
        return done(null, false)
      }
      done(null, user)
    }
    catch (err) {
      console.log(err)
      done(null, false)
    }
  }
)
