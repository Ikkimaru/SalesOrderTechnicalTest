const express = require('express');
const session = require('express-session');
const passport = require('./config/passport');  // Ensure this path is correct
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');

const app = express();

app.use(express.json());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/orders', orderRoutes);

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
