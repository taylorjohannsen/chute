const mongoose = require('mongoose');

// mongodb user model
const newComment = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId, 
        ref: 'User', 
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
},
{
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});

newPost.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'post'
});

newPost.pre('findOne', autoPopulateComments)
newPost.pre('find', autoPopulateComments)

function autoPopulateComments (next) {
  this.populate('comments', 'body')
  next()
}

const Post = mongoose.model('Post', newPost);

module.exports = Post;