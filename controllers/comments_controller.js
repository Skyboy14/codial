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

module.exports.destroy = function (req, res) {
    Comment.findById(req.params.id)
        .then((comment) => {
            // .id means converting the object id into string
            if (comment.user == req.user.id) {
                let postId = comment.post
                comment.deleteOne();
                Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } })
                    .then(() => { return res.redirect('back'); })
                    .catch((err) => {
                        return res.redirect('back');
                    });
            } else {
                return res.redirect('back');
            }

        })
        .catch((err) => { console.log("***-last", err) });
}