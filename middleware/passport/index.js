const passport = require('passport')

const localStrategy = require('./strategy/localStrategy')

passport.use('local', localStrategy)

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (user, done) {
  done(null, user)
})

module.exports = passport