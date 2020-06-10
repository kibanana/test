const express = require('express')
const passport = require('./middleware/passport')
const api = require('./routes/api')

require('dotenv').config()
require('./model')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(passport.initialize())
app.use(passport.session())

app.use('/api', api)

app.listen(3000, () => {
  console.log('Server is listening on port 3000!')
})
