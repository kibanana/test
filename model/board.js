const mongoose = require('mongoose')
const ObjectId = require('mongoose').Types.ObjectId

const boardSchema = mongoose.Schema({
  userId: { type: ObjectId, ref: 'User'},
  title: { type: String, index: 'text' },
  body: { type: String },
  likeMembers: { type: [{ type: ObjectId, ref: 'User'}] }, // 좋아요
  createdAt: { type: Date, default: Date.now }
})

boardSchema.statics.createBoard = function (param) {
  const { userId, title, body } = param
  return this.create({ userId, title, body })
    .then((result) => result._id)
}
 
boardSchema.statics.findBoards = function (searchString) { // 어차피 없으면 undefined
  const aggregation = [
    { $project: { userId: true, title: true, createdAt: true } }
  ]
  if (searchString) {
    aggregation.unshift({ $match: { $text: { $search: searchString } } },
      { $sort: { score: { $meta: "textScore" } } },)
  }
  
  return this.aggregate(aggregation)
}

boardSchema.statics.findBoard = function (id) {
  return this.find({ _id: id }, { likeMembers: false })
}

boardSchema.statics.changeBoard = function (param) { // userId는 JWT에서
  const { id, userId, title, body } = param
  const updateQuery = { }
  if (title) updateQuery.title = title
  if (body) updateQuery.body = body

  return this.updateOne({ _id: id, userId }, updateQuery)
}

boardSchema.statics.deleteBoard = function (id, userId) { // userId는 JWT에서
  return this.deleteOne({ _id: id, userId })
}

boardSchema.statics.addLikeMember = function (id, userId) {
  // this.updateOne({ _id: id }, { $addToSet: { likeMembers: ObjectId(userId) } })
  // addToSet을 사용하면 따로 체크할 필요 없다
  return this.updateOne({
    _id: id, 
    likeMembers: { $ne: ObjectId(userId) },
  }, {
    $push: { likeMembers: ObjectId(userId) } 
  })
}

boardSchema.statics.removeLikeMember = function (id, userId) {
  return this.updateOne({
    _id: id, 
    likeMembers: { $eq: ObjectId(userId) },
  }, {
    $pull: { likeMembers: ObjectId(userId) } 
  })
}

module.exports = mongoose.model('Board', boardSchema)
