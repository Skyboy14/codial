const Post = require('../models/post')

module.exports.home = function (req, res) {
    // Post.find({})
    //     .then((posts) => {
    //         return res.render('home', {
    //             title: 'Codial | Home',
    //             posts: posts
    //         })
    //     })
    //     .catch((err) => console.log('error occured'))

    Post.find({})
        .populate('user')
        .populate({
            path: 'comment',
            populate: {
                path: 'user'
            }
        })
        .exec()
        .then((posts) => {
            if (!posts) {
                // Post does not exist
                console.log('Posts not found');
                res.redirect('/');
                return;
            }
            return res.render('home', {
                title: 'Codial | Home',
                posts: posts
            })
        })
        .catch((err) => console.log('error occured', err))
}