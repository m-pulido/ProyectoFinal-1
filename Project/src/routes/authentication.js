const express = require('express');
const router = express.Router();

const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../lib/access');

// Render the signup
router.get('/signup', isNotLoggedIn, (req, res) =>{
    res.render('auth/signup');
});

// Receive the data to signup 
router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));

// Render the signin
router.get('/signin', isNotLoggedIn, (req, res) => {
    res.render('auth/signin');
});

// Receive the data to signin
router.post('/signin', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/menu',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);
});

// Render the menu 
router.get('/menu', isLoggedIn, (req, res) => {
    res.render('menu');
});

// Render the logout
router.get('/logout', isLoggedIn, (req, res) => {
    req.logOut();
    res.redirect('/signin');
});

module.exports = router;