const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/test', {
  useNewUrlParser: true,
  autoReconnect: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 10000
})

module.exports = mongoose;
