const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy
const crypto = require('crypto')
const User = require('../models/user');

// tell passport to use new strategy for google login
passport.use(new googleStrategy({
    clientID: "80848604797-venqh2f98jqsafu4a4fj46pl8bigu38k.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:8000/users/auth/google/callback"
},

    // find the user
    function (accessToken, refreshToken, profile, done) {
        User.findOne({ email: profile.emails[0].value })
            .exec()
            .then((user) => {
                console.log(accessToken, refreshToken);
                console.log(profile);

                // if found the user, set user as req.user
                if (user) {
                    return done(null, user);
                } else {
                    // if not found , create the user and set it as req.user
                    User.create({
                        name: profile.displayName || profile.emails[0].value,
                        email: profile.emails[0].value,
                        password: crypto.randomBytes(20).toString('hex')
                    })
                        .then((user) => {
                            return done(null, user);
                        })
                        .catch((err) => {
                            if (user) { console.log('error in creaeing user in google passport', err); return }
                        })
                }

            })
            .catch((err) => {
                if (err) { console.log('error in google strategy passport', err); return }
            })
    }))

module.exports = passport;