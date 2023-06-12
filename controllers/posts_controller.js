const Post = require('../models/post');
const Comment = require('../models/comment')

module.exports.create = async function (req, res) {
    try {
        await Post.create({
            content: req.body.content,
            user: req.user._id
        })
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