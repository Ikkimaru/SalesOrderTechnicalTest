const jwt = require('jsonwebtoken');

// Middleware to verify the token
function authenticateToken(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({error: 'Access denied, no token provided'});
    }

    jwt.verify(token, 'your-secret-key', (err, user) => {
        if (err) {
            return res.status(403).json({error: 'Invalid token'});
        }

        req.user = user; // Add the user information to the request object
        next(); // Proceed to the next middleware or route handler
    });
}

function ensureRole(role) {
    return (req, res, next) => {
        if (req.isAuthenticated() && req.user.role === role) {
            return next();
        }
        res.status(403).send('Forbidden');
    };
}

module.exports = { authenticateToken, ensureRole };
