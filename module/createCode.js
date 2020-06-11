const crypto = require('crypto')

module.exports = () => {
  const firstKey = crypto.randomBytes(256).toString('hex').substr(100, 5); // 5자리
  const secondKey = crypto.randomBytes(256).toString('base64').substr(50, 5); // 5자리
  return (firstKey + secondKey).replace(/\//g, '');
}
