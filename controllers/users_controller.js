const User = require('../models/user');

module.exports.profile = function (req, res) {
    User.findById(req.params.id)
        .then((user) => {
            return res.render('user_profile', {
                title: "User Profile",
                profile_user: user
            })
        })

}

module.exports.update = function (req, res) {
    if (req.user.id == req.params.id) {
        User.findByIdAndUpdate(req.params.id, req.body)
            .then(() => {
                req.flash('success', 'you signed in successfully')
                return res.redirect('back')
            })
            .catch((err) => console.log(err))
    } else {
        return res.status(401).send('Unathorized')
    }

}

//Render Sign-Up Page
module.exports.signup = function (req, res) {
    if (req.isAuthenticated()) {
        req.flash('success', 'you signed in successfully')
        return res.redirect('/users/profile')
    }

    req.flash('error', 'you sdont have account')

    return res.render('user_signup', {
        title: "Codial | Sign UP"
    })
}

//Render Sign-In Page
module.exports.signin = function (req, res) {
    if (req.isAuthenticated()) {
        req.flash('success', 'you signed in successfully')
        return res.redirect('/users/profile')
    }

    return res.render('user_signin', {
        title: "Codial | Sign IN"
    })
}

//Get Sign-Up Data
module.exports.create = function (req, res) {
    if (req.body.password != req.body.confirm_password) {
        req.flash('error', 'password doect match')
        return res.redirect('back');
    }
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                User.create(req.body)
                    .then(() => { req.flash('success', 'You Created the User'); return res.redirect('/users/sign-in') })
                    .catch((err) => { req.flash('error', 'error in creating user while signing up'); return })

            } else {
                return res.redirect('back');
            }
        })
        .catch((err) => {
            if (err) { req.flash('error', 'error in finding user in signing up'); return }
        })
}

//Get Sign-IN Data and create session for user
module.exports.createSession = function (req, res) {
    req.flash('success', 'logged in Successfully');
    return res.redirect('/');
}

module.exports.destroySession = function (req, res) {
    req.logout(req.user, err => {
        if (err) return next(err);
        req.flash('success', 'logged in Logged Out');
        res.redirect('/');
    });


}