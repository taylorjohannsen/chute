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
    User.findOne({ _id: req.user.id }).populate('posts').exec((err, session) => {
        Post.find({}).populate('user').sort({date: -1}).limit(15).exec((err, posts) => {
            Post.find({ user: session }).sort({date: -1}).limit(4).exec((err, userposts) => {
                res.render('dashboard', {posts: posts, session: session, userposts: userposts});
            });
        });    
    });
});

// new post page
router.get('/post/:id', ensureAuthenticated, (req, res) => {
    User.findOne({ _id: req.user.id }).exec((err, user) => {
        Post.findOne({ _id: req.params.id }).populate('comments.author').populate('user').sort({date: -1}).exec((err, post) => {
            if (err) throw err;
            res.render('post', {post: post, session: user});
        });
    });
});

// profile page
router.get('/profile/:id', ensureAuthenticated, (req, res) => {
    User.findOne({ _id: req.params.id }).exec((err, user) => {
        Post.find({ user: user }).sort({date: -1}).exec((err, posts) => {
            User.findOne({ _id: req.user.id }).exec((err, session) => {
                res.render('profile', { user: user, posts: posts, session: session })
            });
        });
    });
});

// my account page
router.get('/account/:id', ensureAuthenticated, (req, res) => {
    User.findOne({ _id: req.params.id }).exec((err, user) => {
        if (err) throw err;
        res.render('account', { session: user });
    });
});


module.exports = router;