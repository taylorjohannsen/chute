const mongoose = require('mongoose');
require('./Post')

// mongodb user model
const testUser = new mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }]
});



const User = mongoose.model('User', testUser, 'users');

module.exports = User;
