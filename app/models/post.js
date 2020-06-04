const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    maxlength: 50,
    required: true
  },
  body: {
    type: String,
    maxlength: 400,
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
  timestamps: true,
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
