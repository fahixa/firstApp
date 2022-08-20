const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const passport = require('passport');

// import user Schema
const User = require('../models/UserSchema');

module.exports = function (passport) {
    passport.use(new LocalStrategy({
        usernameField: 'email'
    },
    function (username, password, done) {
        User.findOne({
            email: email,
        })
            .then(async (user) => {
                console.log(user);
                if (user) {
                    if (await bcrypt.compare(password, user.password)) {
                        console.log(password, ' = ', user.password);
                        return done(null, user);
                    } else {
                        return done(null, false, { msg: 'Password is incorrect' });
                    }
                } else {
                    return done(null, false, { msg: 'Email is not registered' });
                }
            }).catch((err) => {
                console.log('Internal Server Error')
            })
    }));
}

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});
