const mongoose = require('mongoose');
require('./Post')

// mongodb user model
const newUser = new mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,

    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: '../public/watericon.png' 
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        default: 'There seems to be nothing here...'
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }]
});



const User = mongoose.model('User', newUser, 'users');

module.exports = User;
