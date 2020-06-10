const express = require('express')
const passport = require('passport')

const controller = require('./auth.controller')
const router = express.Router()

router.post('/sign-up', controller.SignUp)
router.post('/sign-up/verify', controller.EmailVerify)
router.get('/sign-up/verify', controller.ConfirmEmailVerify)
router.post('/sign-in', passport.authenticate('local', { failureRedirect: '/api/auth/sign-in-failed' }), controller.SignIn)

router.get('/sign-in-failed', controller.SignInFailed)

router.post('/jwt-verify', passport.authenticate('jwt'), controller.JwtVerify)

module.exports = router
