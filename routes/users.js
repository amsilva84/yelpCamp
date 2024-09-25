const express = require('express');
const router = express.Router();
// require user from the user model
const User =  require('../models/user')
// require password
const passport = require('passport')
// require storecurrentURL
const {storeReturnTo}= require('../middleware.js');

const catchError = require('../models/utils/wrapError.js');

// register page
router.get('/register', (req, res) => {
    res.render('users/register')
})

// post to register route and create new user
// use flash for error messages using try and cath
router.post('/register',  catchError (async(req, res) => {
    try {
        // deconstruct from req.body and grab email, username, password
        const {email, username, password} = req.body;
        // pass email and username using mongoose model "new User"
        const initializeUser = new User({email, username})
        // use method register for createUser and hash password using passport
        const registerUser = await User.register(initializeUser, password);
        // req.login automatically logins the registered user
        req.login(registerUser, err => {
            if (err) return next(err);
            console.log(registerUser);
            req.flash('success', 'Welcome to Yelp Camp');
            res.redirect('/campgrounds');
        })
        
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
})

// using passport method to login using flash and redirect. storeReturnTo middleware saves the original URL the user was on before login
router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect:'/login' }), (req, res) => {
    req.flash('success', 'Welcome back');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
});



// logout route
router.get('/logout', (req, res) => {
    req.logout(function (err){
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye');
        res.redirect('/campgrounds');
    });
    
});

module.exports = router;