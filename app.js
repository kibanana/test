const express = require('express')
const passport = require('./middleware/passport')
const api = require('./routes/api')

const http = require('http')
const faker = require('faker')

require('dotenv').config()
require('./model')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(passport.initialize())
app.use(passport.session())

app.use('/api', api)

const server = http.createServer(app)
const io = require('socket.io')(server)

io.on('connection', (socket) => {
  socket.nickname = faker.name.findName()
  socket.join('room')
  socket.broadcast.to('room').emit('add_user', {
    nickname: socket.nickname,
    message: `${socket.nickname}이(가) 채팅방에 참여합니다.`
  })
  socket.on('disconnect', () => {
    socket.broadcast.to('room').emit('remove_user', {
      nickname: socket.nickname,
      message: `${socket.nickname}이(가) 채팅방을 떠났습니다.`
    })
    socket.leaveAll()
  })
})

server.listen(3000, () => {
  console.log('Server is listening on port 3000!')
})
