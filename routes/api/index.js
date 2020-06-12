const express = require('express')

const auth = require('./auth')
const user = require('./user')
const board = require('./board')
const file = require('./file')

const api = express.Router()

api.use('/auth', auth)
api.use('/user', user)
api.use('/boards', board)
api.use('/files', file)

module.exports = api
