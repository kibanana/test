const crypto = require('crypto-js')
const { SHA_SALT: KEY } = require('../config')

module.exports = (password) => {
  return crypto.SHA256(password, KEY)
}