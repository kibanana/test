const mongoose = require('mongoose')

const fontSchema = mongoose.Schema({
  fileName: String,
  postscriptName: String,
  fullName: String,
  familyName: String,
  subfamilyName: String,
  copyright: String,
  version: String
})

fontSchema.statics.createFont = async function (param) {
  const { fileName, postscriptName, fullName, familyName, subfamilyName, copyright, version } = param
  if ((await this.countDocuments({ $or: [ { fileName }, { postscriptName }] }).exec()) > 0) {
    return
  }
  return this.create({ fileName, postscriptName, fullName, familyName, subfamilyName, copyright, version })
}

fontSchema.statics.findFontList = function () {
  return this.find({})
}

module.exports = mongoose.model('Font', fontSchema)
