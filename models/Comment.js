const mongoose = require('mongoose');
require('./User');
require('./Post');

// mongodb post model
const newComment = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    content: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }
});


const Comment = mongoose.model('Comment', newComment, 'comments');


module.exports = Comment;