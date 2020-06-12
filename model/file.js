const mongoose = require('mongoose')
const ObjectId = require('mongoose').Types.ObjectId

const fileSchema = mongoose.Schema({
	filename: { type: String },
	filepath: { type: String },
	uploaderId: { type: ObjectId, ref: 'User' },
	createdAt: { type: Date, default: Date.now }
})

// 이전에 controller에서 암호화
fileSchema.statics.createFile = function (param) {
	const { filename, newFilepath: filepath, userId } = param
	return this.create({ filename, filepath, uploaderId: ObjectId(userId) })
}

// 다운로드 전 파일 목록 확인
fileSchema.statics.findFileList = function () {
	return this.find({}, { filepath: false })
}

// 이후에 controller에서 복호화
fileSchema.statics.findFile = function (id) {
	return this.findById(ObjectId(id))
}

module.exports = mongoose.model('File', fileSchema)
