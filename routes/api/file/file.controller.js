const crypto = require('crypto')
const fs = require('graceful-fs')
const path = require('path')

const { AES_KEY, AES_IV } = require('../../../config')

const File = require('../../../model/file')

const message = require('../../../module/message')
const { FailedMessageObj, OBJECT_ID_LENGTH } = require('../../../module/constants')
const { SuccessMessage, FailedMessage, InternalErrorMessage } = message

exports.FindFiles = async (req, res) => {
  try {
    const files = await File.findFileList()
    res.send(new SuccessMessage(files))
  }
  catch (err) {
    console.log(err)
    res.status(500).send(new InternalErrorMessage())
  }
}

exports.DownloadFile = async (req, res) => {
  try {
    const { id } = req.params
    if (!id || id.length != OBJECT_ID_LENGTH) {
      return res.send(new FailedMessage(FailedMessageObj.INVALID_PARAM))
    }
    
    const file = await File.findFile(id)
    const decipher = crypto.createDecipheriv('aes-256-ctr', AES_KEY, AES_IV)
    decipher
      .on('error', err => console.log(err) )

    const readStream = fs.createReadStream(file.filepath, { flags: 'r' })
    res.setHeader('Content-disposition', `attachment; filename=${file.filename}`)
    readStream
      .on('error', err => {
        console.log(err)
        res.status(500).end()
      })
      .pipe(decipher)
      .pipe(res)
      .on('finish', () => {
        readStream.close()
      })
  }
  catch (err) {
    console.log(err)
    res.status(500).send(new InternalErrorMessage())
  }
}

exports.UploadFile = (req, res) => {
  try {
    const userId = req.user._id
    const { path: filepath, filename } = req.file
    if (!(userId && filename && filepath)) {
      res.status(400).send(new FailedMessage(FailedMessageObj.INVALID_PARAM))
    }
    await File.createFile({ filename, newFilepath, userId })

    const cipher = crypto.createCipheriv('aes-256-ctr', AES_KEY, AES_IV)
    cipher
      .on('error', err => console.log(err) )

    const ext = path.extname(filepath)
    const basename = path.basename(filepath).replace(ext, '')
    const newFilepath = filepath.replace(basename, `${basename}_${Date.now()}`) // 이름 변경

    const readStream = fs.createReadStream(filepath)
    const writeStream = fs.createWriteStream(newFilepath)

    readStream
      .on('error', err => {
        console.log(err)
        res.status(500).send(InternalErrorMessage())
      })
      .pipe(cipher)
      .pipe(writeStream)
      .on('finish', () => {
        readStream.close()
        writeStream.close()
        fs.unlinkSync(filepath)
        res.send(new SuccessMessage())
      })
  }
  catch (err) {
    console.log(err)
    res.status(500).send(new InternalErrorMessage())
  }
}
