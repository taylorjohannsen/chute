const mongoose = require('mongoose');
require('./User');

// mongodb post model
const aComment = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
});


const Comment = mongoose.model('Comment', aComment, 'comments');


module.exports = Comment;