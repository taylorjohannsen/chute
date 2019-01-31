const mongoose = require('mongoose');

// mongodb comment model
const newComment = new mongoose.Schema({
    body: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Post = mongoose.model('Comment', newComment, 'comments');

module.exports = Post;