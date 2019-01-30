const mongoose = require('mongoose');
require('./User');

// mongodb post model
const testPost = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Post = mongoose.model('Post', testPost, 'posts');


module.exports = Post;