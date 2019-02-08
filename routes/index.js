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
});

// user dashboard page
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    User.findOne({ _id: req.user.id }).populate('posts').exec((err, user) => {
        Post.find({}).populate('user').sort({date: -1}).limit(20).exec((err, posts) => {
            Post.find({ user: user }).sort({date: -1}).limit(4).exec((err, userposts) => {
                res.render('dashboard', {posts: posts, user: user, userposts: userposts});
            });
        });    
    });
});

// new post page
router.get('/post/:id', ensureAuthenticated, (req, res) => {
    Post.findOne({ _id: req.params.id })
    .populate('comments.author').populate('user').sort({date: -1}).exec((err, post) => {
        if (err) throw err;
        res.render('post', post);
    });
});

// profile page
router.get('/profile/:id', ensureAuthenticated, (req, res) => {
    User.findOne({ _id: req.params.id }).exec((err, user) => {
        Post.find({ user: user }).sort({date: -1}).exec((err, posts) => {
            res.render('profile', { user: user, posts: posts})
        });
    });
});

// my account page
router.get('/account/:id', ensureAuthenticated, (req, res) => {
    User.findOne({ _id: req.params.id }).exec((err, user) => {
        if (err) throw err;
        res.render('account', user);
    });
});


module.exports = router;