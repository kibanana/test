const express = require('express')

const auth = require('./auth')
const user = require('./user')
const board = require('./board')

const api = express.Router()

api.use('/auth', auth)
api.use('/user', user)
api.use('/', board)

module.exports = api
