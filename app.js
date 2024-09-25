// express requirements:
const express = require('express');
const app = express();
app.listen(4000, () => {
    console.log('listening on port 4000')
})
// require express sessions/cookies
const session = require('express-session');

// require flash
const flash = require('connect-flash');

// require password and login type
const passport = require('passport');
const localAuth = require('passport-local');

// require user model for passport
const User = require('./models/user')

// this is the express error
const ExpressError = require('./models/utils/expressError')

// require compgrounds router
const campgrounds = require('./routes/campgrounds')

// require review router
const reviews = require('./routes/reviews')

// require user routes
const userRoutes = require('./routes/users')

// EJS requirements and ejs-mate
const ejsMate = require('ejs-mate');
app.set('view engine', 'ejs')
app.engine('ejs', ejsMate);
const path = require('path');
app.set('views', path.join(__dirname, 'views'))

// dont remember what this is for...
app.use(express.static(path.join(__dirname, 'public')))
// require joi campgraound and review schema. Desctructured
const {campgroundJoiSchema, reviewJoiSchema} = require('./schemas');

// this is a temp solution for session testing and not for prod 
const sessionConfig = {
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // one week
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,    
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}
// apply session config to session
app.use(session(sessionConfig))

// utilize initialize for passport. passport session needs to go after sessionconfig
app.use(passport.initialize());
app.use(passport.session());
// authenticate method for passport
passport.use(new localAuth(User.authenticate())),
// other methods for sessions local authentication
passport.serializeUser(User.serializeUser()),
passport.deserializeUser(User.deserializeUser()),

// use flash 
app.use(flash());
// create flash middleware and middleware to check if there is someone logged in using req.user from passport
app.use((req, res, next) => {
    res.locals.loggedUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    next();
})




// require error handling class module built
// this is the function





// Moongoose and models requirements
const mongoose = require('mongoose');
const Campground = require('./models/campground')
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/yelpCamp');
}
// middleware

// morgan (console messages)
const morgan = require('morgan');
app.use(morgan('tiny'))

// post requirement
app.use(express.urlencoded({extended:true}))
// used for method put required with override
const methodOverride = require('method-override');
app.use(methodOverride('_method'))







// routes------

// use the campgrounds router for any campgrounds route
app.use('/campgrounds', campgrounds )

// use the review router for any review routes
app.use('/campgrounds/:id/reviews', reviews)

// utilize the user routes
app.use('/', userRoutes)

    // home page
app.get('/', (req, res) => {
    res.render('home')
})

   


    // app.get('/campgrounds', async (req, res) => {
//    const campgrounds = await Campground.find({}); 
//    res.render('campgrounds/index', { campgrounds })
// })


    




// express error messaage and status code pass to next
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

// pass the express error above into this function 
app.use((err, req, res, next) => {
    // destructure from message
    const {statusCode = 500}  = err;
    if (!err.message) err.message = 'SOMETHING WENT WRONG!'
    res.status(statusCode).render('error', {err})
 

})






    





    // objects ID are in the req.params. this descructures the data: const { id } 
// app.get('/products/:id', async (req, res) => {
//     const { id }  = req.params;
//     const foundProduct = await Product.findById(id)
//     res.render('products/details.ejs', { foundProduct })
    // newcampground
