const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = require('../models/Post');
const User = require('../models/User');
const { ensureAuthenticated } = require('../config/auth');
const { toMainpage } = require('../config/mainpage');

// landing page 
router.get('/', toMainpage, (req, res) => {
    res.render('mainpage');
})

// user dashboard page
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    Post.find({}).populate('user', 'password name').sort({date: -1}).exec((err, posts) => {
        res.render('dashboard', {posts: posts, userid: req.user.id});
    })
});

// new post page
router.get('/post/:id', ensureAuthenticated, (req, res) => {
    Post.findOne({ _id: req.params.id }).populate('user', 'password name').populate('comments', 'body user').sort({ field: 'asc', _id: -1 }).limit(1).exec((err, post) => {
        res.render('post', post);
    })
});

// profile page
router.get('/profile/:id', ensureAuthenticated, (req, res) => {
    User.findOne({ _id: req.params.id }).populate('post').sort({ field: 'asc', _id: -1 }).exec((err, user) => {
        res.render('profile', user);
    })
});


module.exports = router;