const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');
const passport = require('passport');
require('../app');

// login page
router.get('/login', (req, res) => {
    res.render('login');
});

// register page
router.get('/register', (req, res) => {
    res.render('register');
});

// register page post to db with user credentials
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    if(!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    if(password !== password2) {
        errors.push({ msg: 'Passwords do not match'});
    }

    if(password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters'});
    }

    if(errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        User.findOne({ email: email })
        .then(user => {
            if(user) {
                errors.push({ msg: 'Email is already registerd' });
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });        
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                        .then(user => {
                            req.flash('success_msg', 'You are now registered and can login');
                            res.redirect('/users/login');
                        })
                        .catch(err => console.log(err));
                    })
                })
            }
        });
    }
});

// submit post handle
router.post('/post', (req, res, next) => {
    User.findById(req.user.id, (err, user) => {

        const newPost = {
            title: req.body.title,
            body: req.body.body,
            user: req.user._id
        }
    
        Post.create(newPost, (err, post) => {
            if (err) throw err;
    
            user.posts.push(newPost);

            user.save()
            .then(post => {
                console.log(newPost);
                res.redirect('/dashboard');
    
            })
        })
    })
});

// login handle 
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// logout handle 
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
})

module.exports = router;