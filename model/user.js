const mongoose = require('mongoose')
const ObjectId = require('mongoose').Types.ObjectId

const createHash = require('../module/createHash')

const userSchema = mongoose.Schema({
  email: { type: String, required: true, trim: true },
  password: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  birthDay: { type: Date },
  createdAt: Date
})

userSchema.statics.chkExistsEmail = async function (email) {
  return (await this.countDocuments({ email }).exec()) > 0
  // true: 중복, false: 사용 가능
}

userSchema.statics.signUp = function (email, password, name) {
  // 1)
  // const user = new this({
  //   email,
  //   password,
  // })
  // user.save()
  // return user
  // 2)
  return this.create({ email, password, name, createdAt: new Date() })
}

userSchema.statics.signIn = function (email) {
  return this.findOne({ email })
}

userSchema.statics.updateUser = function (id, user) {
  return this.updateOne({ _id: new ObjectId(id) }, { ...user })
}

userSchema.statics.updateUserPassword = function (id, password) {
  return this.findByIdAndUpdate(id, { $set: { password } })
    .then((result) => {
      return result ? true : false
    })
}

userSchema.statics.deleteUser = function (id) {
  return this.findByIdAndDelete(id)
}

userSchema.methods.verify = function (password) {
  return this.password === createHash(password).toString()
}

userSchema.pre('save', function (next) {
  this.password = createHash(this.password).toString()
  next()
})

module.exports = mongoose.model('User', userSchema)
