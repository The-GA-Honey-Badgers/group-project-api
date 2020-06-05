const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  body: {
    type: String,
    maxlength: 200,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    default: null
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  }
}, {
  timestamps: true,
  toObject: {
    virtuals: true
  }
})

commentSchema.virtual('children', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parent'
})

module.exports = mongoose.model('Comment', commentSchema)
