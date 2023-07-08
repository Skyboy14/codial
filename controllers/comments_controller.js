const Comment = require('../models/comment');
const Post = require('../models/post');
const commentMailer = require('../mailers/comment_mailers');

module.exports.create = async function (req, res) {
    try {
        let post = await Post.findById(req.body.post)
        if (!post) {
            // Post does not exist
            console.log('Post not found');
            res.redirect('/');
            return;
        } else {
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            })
            post.comment.push(comment);
            post.save();

            comment = await comment.populate('user', 'name email');
            commentMailer.newComment(comment);

            if (req.xhr) {

                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: 'Post Created'
                })
            }
            res.redirect('/');
            req.flash('success', 'comment Publish')
        }
    } catch (err) {
        console.log('error while posting comment', err)
    }
}

module.exports.destroy = async function (req, res) {
    try {
        let comment = await Comment.findById(req.params.id)
        // .id means converting the object id into string
        if (comment.user == req.user.id) {
            let postId = comment.post
            comment.deleteOne();
            let post = Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } })

            return res.redirect('back');

        } else {
            return res.redirect('back');
        }

    } catch (err) {
        console.log("***-last", err)
    }
}