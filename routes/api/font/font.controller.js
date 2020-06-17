const fs = require('fs')
const path = require('path')
const fontkit = require('fontkit')
const { promisify } = require('util')

const Font = require('../../../model/font')

const unzip = require('../../../module/unzip')
const { searchDfs, deleteDfs } = require('../../../module/dfs')

const message = require('../../../module/message')
const { FailedMessageObj } = require('../../../module/constants')
const { SuccessMessage, FailedMessage, InternalErrorMessage } = message

const readdirPromise = promisify(fs.readdir)

exports.UploadFont = async (req, res) => {
  try {
    let { path: zippath, destination: unzippath } = req.file
    unzippath = path.join(unzippath, path.basename(zippath, path.extname(zippath)))
    if (!(zippath && unzippath)) {
      return res.status(400).send(new FailedMessage(FailedMessageObj.INVALID_PARAM))
    }
    const fontspath = path.join(__dirname, '..', '..', '..', 'fonts')
    
    let readdirList = await readdirPromise(fontspath) // 1차 (중복 확인 위함)
    await unzip(zippath, unzippath, readdirList)
      .catch(err => {
        console.log(err)
      })
    const unzipList = (await searchDfs(unzippath)) || 0
    for (let i = 0; i < unzipList.length; i++) {
      const fontReadStream = fs.createReadStream(unzipList[i])
      const fontWriteStream = fs.createWriteStream(path.join(fontspath, path.basename(unzipList[i])))

      fontReadStream
        .on('error', err => {
          console.log(err)
        })
        .pipe(fontWriteStream)
        .on('finish', () => {
          fontReadStream.close()
          fontWriteStream.close()
        })
    }
    readdirList = await readdirPromise(fontspath) // 2차 (옮긴 파일 경로 불러오기 위함)
    for (let i = 0; i < readdirList.length; i++) {
      let font = null
      try {
        font = fontkit.openSync(path.join(fontspath, readdirList[i]))
      }
      catch (err) { }
      if (font) {
        await Font.createFont(Object.assign(font, { fileName: readdirList[i] }))
      }
    }
    // const promiseArr = []
    // filepaths.forEach(fp => { // forEach 내 async/await는 동기 X
    //   const font = fontkit.open(fp)
    //   promiseArr.push(Font.createFont(font))
    // })
    // await Promise.all(promiseArr)
    res.send(new SuccessMessage())
  }
  catch (err) {
    console.log(err)
    res.status(500).send(new InternalErrorMessage())
  }
  // 되든 말든 오류 처리만
  await deleteDfs(path.join(req.file.destination, path.basename(req.file.path, path.extname(req.file.path))))
    .catch(err => {
      console.log(err)
    })
}

exports.FindFonts = async (req, res) => {
  try {
    const result = await Font.findFontList()
    res.send(new SuccessMessage(result))
  }
  catch (err) {
    res.status(500).send(new InternalErrorMessage())
  }
}
