const User = require('../models/user');
const fs = require('fs');
const path = require('path');

module.exports.profile = function (req, res) {
    User.findById(req.params.id)
        .then((user) => {
            return res.render('user_profile', {
                title: "User Profile",
                profile_user: user
            })
        })

}

module.exports.update = async function (req, res) {
    // if (req.user.id == req.params.id) {
    //     User.findByIdAndUpdate(req.params.id, req.body)
    //         .then(() => {
    //             req.flash('success', 'you signed in successfully')
    //             return res.redirect('back')
    //         })
    //         .catch((err) => console.log(err))
    // } else {
    //     return res.status(401).send('Unathorized')
    // }

    if (req.user.id == req.params.id) {

        try {
            let user = await User.findByIdAndUpdate(req.params.id);
            User.uploadedAvatar(req, res, function (err) {
                if (err) {
                    console.log('******* Multer error', err)
                }
                user.name = req.body.name;
                user.email = req.body.email;

                if (req.file) {

                    // delet the existing profile pic if we add new profile
                    if (user.avatar) {
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar))
                    }

                    // saving path of uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename
                }
                user.save();
                return res.redirect('back')
            })

        } catch (err) {
            req.flash('error', err)
            return res.redirect('back')
        }

    } else {
        req.flash('error', 'Unathorized')
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