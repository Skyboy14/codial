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

    Post.find({}).populate('user').exec()
        .then((posts) => {
            return res.render('home', {
                title: 'Codial | Home',
                posts: posts
            })
        })
        .catch((err) => console.log('error occured', err))
}