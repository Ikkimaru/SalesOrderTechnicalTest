const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const UserService = require('../services/user.service');
const router = express.Router();

// Register route (for testing, in real life this would likely be admin-only)
router.post('/register', async (req, res) => {
    const { username, password, role } = req.body;
    try {
        const user = await UserService.createUser(username, password, role);
        res.status(201).json({ message: 'User created', user });
    } catch (err) {
        res.status(500).json({ message: 'Error creating user' });
    }
});

// Login route
router.post('/login', function(req, res, next) {
    passport.authenticate('local', async function(err, user, info) {
        if (err) {
            // Handle any error that occurred during authentication
            return res.status(500).json({ message: 'An error occurred during authentication.' });
        }
        if (!user) {
            // If no user found, respond with failure message
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        // Log in the user manually
        req.login(user, function(err) {
            if (err) {
                // Handle any error during the login process
                return res.status(500).json({ message: 'Login failed.' });
            }

            // Successful login, send back the user data or a success message
            const token = jwt.sign(
                { id: req.user.id, username: req.user.username, role: req.user.role }, // payload
                'your-secret-key', // secret key (should be stored in a secure location)
                { expiresIn: '1h' } // token expiration time (optional)
            );

            // Send the token in the response
            res.json({ message: 'Login successful', token });
        });
    })(req, res, next);
});

// Logout route
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('/');
    });
});

module.exports = router;
