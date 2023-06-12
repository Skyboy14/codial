const Post = require('../models/post');
const Comment = require('../models/comment')

module.exports.create = function (req, res) {
    Post.create({
        content: req.body.content,
        user: req.user._id
    })
        .then(() => { return res.redirect('back') })
        .catch((err) => { console.log('error in creating post'); return })
}

module.exports.destroy = function (req, res) {
    Post.findById(req.params.id)
        .then((post) => {
            // .id means converting the object id into string
            if (post.user == req.user.id) {
                post.deleteOne();
                Comment.deleteMany({ post: req.params.id })
                    .then(() => { return res.redirect('back'); })
                    .catch((err) => {
                        return res.redirect('back');
                    });
            } else {
                return res.redirect('back');
            }

        })
        .catch((err) => { console.log("***", err) });
}