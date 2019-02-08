const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../models/User');
const Post = require('../models/Post');
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');
const passport = require('passport');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
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
                errors.push({ msg: 'Email is already registered' });
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });        
            } else {
                const newUser = new User({
                    name: name,
                    email: email,
                    password: password,
                    _id: new mongoose.Types.ObjectId(),
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
    const { title, body } = req.body;
    User.findById(req.user.id, (err, user) => {

        if(!title || !body) {
            req.flash('posterror', 'Please fill in all fields');
            res.redirect('/dashboard');
        } else {
            let newPost = new Post({
                title: req.body.title,
                body: req.body.body,
                user: req.user._id,
                _id: new mongoose.Types.ObjectId(),
            })
            user.posts.push(newPost);
            newPost.save(function(err) {
                if (err) throw err;
                res.redirect('/post/' + newPost._id);
            })    
        }
   })
});

// submit comment handle
router.post('/comment/:id', (req, res, next) => {
    Post.findById(req.params.id, (err, post) => {
        if(!req.body.content) {
            req.flash('commenterror', 'Comment cannot be empty');
            res.redirect('back');
        } else {
            let myComment = ({
                content: req.body.content,
                author: req.user.id,
                post: post._id,
                _id: new mongoose.Types.ObjectId()
            });
            
            post.comments.push(myComment);
            post.markModified('comments');

            post.save(function(err) {
                if (err) throw err;
                res.redirect('back');
            })
        }
    })
});

// multer setup
const storage = multer.diskStorage({
    destination: './public/pictures',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('myImage');

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error - Images Only!');
    }
}

// submit photo handle
router.post('/upload', (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            req.flash('photoerror', 'Incorrect file type - .jpeg, .png, .jpg, .gif only ');
            res.redirect('back');
        } else {
            User.updateOne({ _id: req.user.id }, {
                image: ('../' + req.file.path)
            }, { new: true }, (err, user) => {
                if (err) throw err;
                req.flash('photosuccess', 'Photo uploaded successfully!');
                res.redirect('/profile/' + req.user.id);
            });    
        }
    });
});

// update description handle
router.post('/update', (req, res, next) => {
    const { desc } = req.body;
    User.updateOne({ _id: req.user.id }, {
        desc: desc
    }, {
        new: true
    },
        (err, user) => {
            if (err) throw err;
            req.flash('descsuccess', 'Description updated successfully!');
            res.redirect('/profile/' + req.user.id);
        });
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
});

module.exports = router;
