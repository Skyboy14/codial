const Post = require('../models/post')
const User = require('../models/user')

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
            User.find({})
                .then((users) => {
                    return res.render('home', {
                        title: 'Codial | Home',
                        posts: posts,
                        all_users: users
                    })
                })
            if (!posts) {
                // Post does not exist
                console.log('Posts not found');
                res.redirect('/');
                return;
            }

        })
        .catch((err) => console.log('error occured', err))
}