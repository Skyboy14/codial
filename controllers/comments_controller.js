const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = function (req, res) {
    Post.findById(req.body.post)
        .then((post) => {
            if (!post) {
                // Post does not exist
                console.log('Post not found');
                res.redirect('/');
                return;
            }
            Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            })
                .then((comment) => {
                    post.comment.push(comment);
                    post.save();
                    res.redirect('/');
                })
                .catch((err) => console.log('error while posting comment', err))
        })
        .catch((err) => {
            console.log('error while finding the post', err)
        })

}