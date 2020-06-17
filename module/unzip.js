const uz = require('unzipper')
const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')

module.exports = (zippath, unzippath, readdirList) => {
  return new Promise((resolve, reject) => {
    let isCausedError = false
    fs.createReadStream(zippath).pipe(uz.Parse())
      .on('entry', entry => {
        const writePath = `${unzippath}/${entry.path}` // Write Path
        const folderPath = path.dirname(writePath) // Write Directory
        if (entry.path.includes('__MACOSX')) return entry.autodrain()
        else if (entry.type == 'Directory') return entry.autodrain() 
        else {
          const write = () => {
            try {
              // const length = entryPath.length
              if (isCausedError) entry.autodrain()
              else if (readdirList.includes(path.basename(entry.path))) entry.autodrain()// 파일명 중복 제거(이미 unzippath에 있는 파일명 배열)
              else {
                const ws = fs.createWriteStream(writePath)
                ws.on('error', e => {
                  isCausedError = true
                  entry.autodrain()
                  console.log(e)
                  reject(e)
                })
                entry.pipe(ws)
              }
            }
            catch (e) {
              isCausedError = true
              console.log(e)
              reject(e)
            }
          }
          fs.access(folderPath, { recursive: true }, err => {
            if (err) {
              console.log(err)
              fs.mkdir(folderPath, { recursive: true }, err => {
                if (err) reject(err)
                else write()
              })
            }
            else write()
          })
        }
      })
      .on('error', err => reject(err))
      .on('close', resolve)
  })
}
