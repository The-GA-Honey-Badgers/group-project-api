'use strict'

// require in dependencies, Post model, middleware
const express = require('express')
const passport = require('passport')
const Post = require('../models/post')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })
const router = express.Router()
// ************************************* //

// INDEX - GET /posts (we will not req a token)
router.get('/posts', (req, res, next) => {
  Post.find()
    .then(posts => {
      return posts.map(post => post.toObject())
    })
    .then(posts => res.status(200).json({ posts: posts }))
    .catch(next)
})

// SHOW - GET /posts/:id (we will not req a token)
router.get('/posts/:id', (req, res, next) => {
  Post.findById(req.params.id)
    .then(handle404)
    .then(post => res.status(200).json({ post: post.toObject() }))
    .catch(next)
})

// CREATE - POST /posts
router.post('/posts', requireToken, (req, res, next) => {
  req.body.post.owner = req.user.id

  Post.create(req.body.post)
    .then(post => {
      res.status(201).json({ post: post.toObject() })
    })
    .catch(next)
})

// UPDATE - PATCH /posts/:id
router.patch('/posts/:id', requireToken, removeBlanks, (req, res, next) => {
  delete req.body.post.owner

  Post.findById(req.params.id)
    .then(handle404)
    .then(post => {
      requireOwnership(req, post)
      return post.updateOne(req.body.post)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

// DESTROY - DELETE /posts/:id
router.delete('/posts/:id', requireToken, (req, res, next) => {
  Post.findById(req.params.id)
    .then(handle404)
    .then(post => {
      requireOwnership(req, post)
      post.deleteOne()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
