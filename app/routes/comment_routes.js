const express = require('express')
const passport = require('passport')

const Comment = require('../models/comment')
const customErrors = require('../../lib/custom_errors_comments')
// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource that's owned by someone else
const requireOwnership = customErrors.requireOwnership
// this is middleware that will remove blank fields from `req.body`, e.g. { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })
// instantiate a router
const router = express.Router()

// CREATE a new comment
router.post('/comments', requireToken, (req, res, next) => {
  // set author of new comment to be current user
  newComment = req.body.comment
  newComment.author = req.user.id

  Comment.create(newComment)
    // respond to succesful `create` with status 201
    .then(comment => res.status(201).json({ comment: comment.toObject() }))
    .catch(next)
})

// UPDATE a comment
router.patch('/comments/:id', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.comment.author
  // console.log('Comment Id: ', req.params.id)
  Comment.findById(req.params.id)
    .then(handle404)
    .then(comment => {
      // pass the `req` object and the Mongoose record to `requireOwnership` it will throw an error if the current user isn't the owner
      requireOwnership(req, comment)
      // pass the result of Mongoose's `.update` to the next `.then`
      return comment.updateOne(req.body.comment, {runValidators: true})
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

// DELETE a comment
router.delete('/comments/:id', requireToken, (req, res, next) => {
  Comment.findById(req.params.id)
    .then(handle404)
    .then(comment => {
      // throw an error if current user doesn't own `comment`
      requireOwnership(req, comment)
      // delete the comment ONLY IF the above didn't throw
      comment.deleteOne()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
