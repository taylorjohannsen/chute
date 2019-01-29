const mongoose = require('mongoose');
const User = require('./User');

// mongodb post model
const newPost = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
});

const Post = mongoose.model('Post', newPost);

module.exports = Post;