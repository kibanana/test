const path = require('path')
const multer = require('multer')

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'files'))
  },
  filename: function (req, file, cb) {
    cb(null, `${path.basename(file.originalname)}`) // 원래 파일명
  }
})

const upload = multer({ storage }).single('newFile')

module.exports = function (req, res, next) {
  upload(req, res, err => {
      if (err) {
          console.log(err)
          return res.status(500).send()
      }
      next()
  })
}
