const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  imgUrl: {
    type: String,
    required: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  toObject: {
    virtuals: true
  }
})

postSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'postId'
})

module.exports = mongoose.model('Post', postSchema)
