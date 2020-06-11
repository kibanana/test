const mongoose = require('mongoose')
const ObjectId = require('mongoose').Types.ObjectId
const createCode = require('../module/createCode')

const codeSchema = mongoose.Schema({ // code는 ObjectId
  email: { type: String },
  userId: { type: ObjectId, ref: 'User' },
  code: { type: String },
	isVerified: { default: false }
})

codeSchema.statics.registerSignUpCode = function (email) {
  const code = createCode()
  this.create({ email, code })
  return code
}

codeSchema.statics.verifySignUpCode = function (email, code) {
	return this.updateOne({ email, code }, { isVerified: true })
}

codeSchema.statics.findVerifiedEmail = async function (email) {
	return (await this.countDocuments({ email, isVerified: true }).exec()) > 0 // true면 회원가입 가능
}

codeSchema.statics.deleteSignUpCode = function (email) {
	return this.deleteMany({ email }) // 중복된 email을 사용하여 이메일 인증을 사용했을 수도 있기 때문
}

codeSchema.statics.registerPasswordCode = async function (userId) {
	const code = createCode()
  await this.updateOne({ userId: ObjectId(userId) }, { code }, { upsert: true })
  return code
}

codeSchema.statics.findPasswordCode = async function (code) {
  return (await this.countDocuments({ code }).exec()) > 0
}

codeSchema.statics.findUserIdByPasswordCode = function (code) {
  return this.findOne({ code }, { userId: true })
}

codeSchema.statics.deletePasswordCode = function (userId) {
  return this.deleteOne({ userId: ObjectId(userId) })
}

module.exports = mongoose.model('Code', codeSchema)
