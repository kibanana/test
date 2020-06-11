const mongoose = require('mongoose')
const ObjectId = require('mongoose').Types.ObjectId

const createHash = require('../module/createHash')

const userSchema = mongoose.Schema({
  email: { type: String, required: true, trim: true },
  password: { type: String, required: true, trim: true },
  nickname: { type: String, trim: true },
  address: { type: String, trim: true },
  birthDay: { type: Date },
  createdAt: Date
})

userSchema.statics.chkExistsEmail = async function (email) {
  return (await this.countDocuments({ email }).exec()) > 0
  // true: 중복, false: 사용 가능
}

userSchema.statics.chkExistsNickname = async function (nickname, id = null) {
  const findQuery = { nickname }
  if (id) {
    findQuery._id = { $ne: new ObjectId(id) }
  }
  return (await this.countDocuments(findQuery).exec()) > 0
}

userSchema.statics.signUp = function (param) {
  const { email, password, nickname, address, birthDay } = param
  // 1)
  // const user = new this({
  //   email,
  //   password,
  // })
  // user.save()
  // return user
  // 2)
  return this.create({ email, password, nickname, address, birthDay, createdAt: new Date() })
}

userSchema.statics.signIn = function (email) {
  return this.findOne({ email })
}

userSchema.statics.findPasswordById = function (id) {
  return this.findOne({ _id: id }, { _id: true, password: true })
}

userSchema.statics.findById = function (id) {
  return this.findOne({ _id: id }, { password: false })
}

userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email }, { _id: true })
}

userSchema.statics.changeUserNickname = function (id, nickname) {
  return this.updateOne({ _id: new ObjectId(id) }, { nickname })
}

userSchema.statics.changeUserInfo = function (param) {
  const { id, address, birthDay } = param
  const updateQuery = { }
  if (address) updateQuery.address = address
  if (birthDay) updateQuery.birthDay = birthDay
  return this.updateOne({ _id: new ObjectId(id) }, updateQuery)
}

userSchema.statics.changeUserPassword = async function (id, newPassword) {
  const result = await this.findOne({ _id: new ObjectId(id) })
  result.password = newPassword
  result.save() // .save()로 끝내야 비밀번호가 정상적으로 변경됨
  return 
}

userSchema.methods.verify = function (password) {
  return this.password === createHash(password).toString()
}

userSchema.pre('save', function (next) {
  this.password = createHash(this.password).toString()
  next()
})

module.exports = mongoose.model('User', userSchema)
