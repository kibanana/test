const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const readdirPromise = promisify(fs.readdir)
const lstatPromise = promisify(fs.lstat)
const unlinkPromise = promisify(fs.unlink)
const removedirPromise = promisify(fs.rmdir)

async function searchDfs (start) { // 트리인 디렉터리 구조는 전달할 필요가 없다, start는 시작 path
  try {
    const dirList = await readdirPromise(start)
    let fonts = []
    for (let i = 0; i < dirList.length; i++) {
      let temp = path.join(start, dirList[i])
      const lstat = await lstatPromise(temp)
      if (lstat.isDirectory()) { // 디렉터리면
        fonts = fonts.concat(await searchDfs(temp)) // 재귀 -> 더 안에서 찾은 폰트 배열을 밖에서 찾은 폰트 배열과 concat 한다 -> return fonts가 누적된(isDirectory와 isFile을 모두 거친) fonts를 반환하므로 가능한 일s
      }
      else if (lstat.isFile()) { // 파일이면
        fonts.push(temp)
      }
    }
    return fonts
  }
  catch (err) {

  }
}

// 언제 리턴해야할까?
// i. isFile -> 어떤 디렉터리의 첫번째 파일을 리턴하고 끝냄
// ii. isDirectory -> 첫 번째 디렉터리의 파일들을 리턴하고 끝냄
// iii. 내가 원하는 것 -> 첫 번째 디렉터리의 파일을 모두 리턴하고 다음 두 번째 디렉터리로 넘어가기
// 그런데 첫 번째 디렉터리의 파일의 path들이 두 번째 디렉터리에 넘어가야하기 때문에 concat해야할 듯


async function deleteDfs (start) {
  try {
    const dirList = await readdirPromise(start)
    for (let i = 0; i < dirList.length; i++) {
      let temp = path.join(start, dirList[i])
      const lstat = await lstatPromise(temp)
      if (lstat.isDirectory()) { // 디렉터리면
        await deleteDfs(temp) // 먼저 재귀 호출
      }
      else if (lstat.isFile()) { // 파일이면
        await unlinkPromise(temp)
      }
    }
    await removedirPromise(start) // 그 뒤 디렉터리 삭제 -> 최상위 디렉터리도 삭제
  }
  catch (err) {

  }
}

module.exports = {
  searchDfs,
  deleteDfs
}
