const Post = require('../../../models/post');
const Comment = require('../../../models/comment')

module.exports.index = async function (req, res) {

    let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comment',
            populate: {
                path: 'user'
            }
        })


    return res.status(200).json({
        message: "List of posts",
        posts: posts
    })
}

module.exports.destroy = async function (req, res) {
    try {
        let post = await Post.findById(req.params.id);
        if (post.user == req.user.id) {
            post.deleteOne();

            // if (req.xhr) {
            //     return res.status(200).json({
            //         data: {
            //             post_id: req.params.id
            //         },
            //         message: 'post deleted'
            //     })
            // }

            // req.flash('success', 'You delete the post')
            await Comment.deleteMany({ post: req.params.id });
            return res.status(200).json({
                message: 'Post and associated comments deleted'
            })
        } else {
            //     req.flash('error', 'You cannot delete the post')
            //     return res.redirect('back');
            return res.status(401).json({
                message: 'You cannot delete this post'
            })
        }
    } catch (err) {
        // req.flash('error', 'error in destroy post')
        console.log('******', err)
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}