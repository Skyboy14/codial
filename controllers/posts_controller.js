const Post = require('../models/post');
const Comment = require('../models/comment')

module.exports.create = async function (req, res) {
    try {
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        })

        if (req.xhr) {
            return res.status(200).json({
                data: {
                    post: post
                },
                message: "Post created!"
            });
        }

        req.flash('success', 'You Added the post')
        return res.redirect('back')
    }
    catch (err) {
        req.flash('error', 'error in creating post'); return
    }
}

module.exports.destroy = async function (req, res) {
    try {
        let post = await Post.findById(req.params.id);
        if (post.user == req.user.id) {
            post.deleteOne();

            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: 'post deleted'
                })
            }

            req.flash('success', 'You delete the post')
            await Comment.deleteMany({ post: req.params.id });
            return res.redirect('back')
        } else {
            req.flash('error', 'You cannot delete the post')
            return res.redirect('back');
        }
    } catch (err) {
        req.flash('error', 'error in destroy post')
        return
    }
}