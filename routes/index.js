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
    User.findById(req.user.id).populate('posts').exec((err, user) => {
        console.log(user.posts);
        res.render('dashboard', user);
    })
})

module.exports = router;