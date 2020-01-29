const express = require('express');
const router = express.Router();

const passport = require('passport');

// Render the signup
router.get('/signup', (req, res) =>{
    res.render('auth/signup');
});

// Receive the data to signup 
router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));

// Render the signin
router.get('/signin', (req, res) => {
    res.render('auth/signin');
});

// Receive the data to signin
router.post('/signin', (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);
});

// Render the profile 
router.get('/profile', (req, res) => {
    res.send('this is your profile');
});

module.exports = router;