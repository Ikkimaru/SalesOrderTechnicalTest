// passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const UserService = require('../services/user.service');

// Serialize user (store user ID in session)
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user (retrieve user by ID from session)
passport.deserializeUser((id, done) => {
    UserService.findById(id)
        .then(user => done(null, user))
        .catch(err => done(err));
});

// Local strategy for username/password authentication
passport.use(new LocalStrategy(
    {
        usernameField: 'username',
        passwordField: 'password',
    },
    (username, password, done) => {
        // Authenticate user using the UserService's authenticate method
        UserService.authenticateUser(username, password)
            .then(user => {
                if (!user) {
                    return done(null, false, { message: 'Incorrect username or password' });
                }
                return done(null, user);
            })
            .catch(err => done(err));
    }
));

module.exports = passport;
