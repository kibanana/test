const passport = require('passport')

const localStrategy = require('./strategy/localStrategy')
const jwtStrategy = require('./strategy/jwtStrategy')

passport.use('local', localStrategy)
passport.use('jwt', jwtStrategy)

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (user, done) {
  done(null, user)
})

module.exports = passport