const express = require('express')
const passport = require('../../middleware/passport')

const auth = require('./auth')
const user = require('./user')

const api = express.Router()

api.use('/auth', auth)
api.use('/user', user)

module.exports = api
