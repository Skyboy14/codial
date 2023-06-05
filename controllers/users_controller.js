const User = require('../models/user');

module.exports.profile = function (req, res) {
    if (req.cookies.user_id) {
        User.findById(req.cookies.user_id)
            .then((user) => {
                return res.render('user_profile', {
                    title: 'User Profile',
                    user: user
                })
            })
            .catch(() => { return res.redirect('/users/sign-in') })
    } else {
        return res.redirect('/users/sign-in')
    }
}

//Render Sign-Up Page
module.exports.signup = function (req, res) {
    return res.render('user_signup', {
        title: "Codial | Sign UP"
    })
}

//Render Sign-In Page
module.exports.signin = function (req, res) {
    return res.render('user_signin', {
        title: "Codial | Sign IN"
    })
}

//Get Sign-Up Data
module.exports.create = function (req, res) {
    if (req.body.password != req.body.confirm_password) {
        return res.redirect('back');
    }
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                User.create(req.body)
                    .then(() => { return res.redirect('/users/sign-in') })
                    .catch((err) => { console.log('error in creating user while signing up', err); return })

            } else {
                return res.redirect('back');
            }
        })
        .catch((err) => {
            if (err) { console.log('error in finding user in signing up'); return }
        })
}

//Get Sign-IN Data
module.exports.createSession = function (req, res) {
    //Steps to authentication
    // Find the user
    User.findOne({ email: req.body.email })
        .then((user) => {
            //handle user found
            if (user) {
                if (user.password != req.body.password) {
                    //handle password which dont match
                    return res.redirect('back');
                }
                //handle session creation
                res.cookie('user_id', user.id);
                return res.redirect('/users/profile');
            }
            //handle user not found
            else {
                return res.redirect('back');
            }
        })
        //handle user not found
        .catch((err) => {
            if (err) { console.log('error in finding user in signing in'); return }
        })








}