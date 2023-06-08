const User = require('../models/user');

module.exports.profile = function (req, res) {
    return res.render('user_profile', {
        title: "Profile"
    })
}

//Render Sign-Up Page
module.exports.signup = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile')
    }

    return res.render('user_signup', {
        title: "Codial | Sign UP"
    })
}

//Render Sign-In Page
module.exports.signin = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile')
    }

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

//Get Sign-IN Data and create session for user
module.exports.createSession = function (req, res) {
    return res.redirect('/');
}

module.exports.destroySession = function (req, res) {
    req.logout(req.user, err => {
        if (err) return next(err);
        res.redirect('/');
    });
}