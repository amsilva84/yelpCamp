// require express error 
const ExpressError = require('./models/utils/expressError');

// require campground model
const Campground = require('./models/campground')

// // require joi campgraound and review schema. Desctructured
const {campgroundJoiSchema, reviewJoiSchema} = require('./schemas.js');




//using passport isauthenticated method, if not signed in flash error to login and redirect to login page, if yes, go next
module.exports.needsLogin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'you must be signed in first!')
        return res.redirect('/login');
    }
    next();
}

// middleware to save the current session and return to it after login
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

// middleware function to validate data and call it in the route
module.exports.validateCampground = (req, res, next) => {
    // pass the data to the joi schema, in this case we are passing req.body but deconstructing the error 
    const {error} = campgroundJoiSchema.validate(req.body);
    // if there is error throw error message and pass it to app.use handler
    // we have to change the error array into a single string to pass it
    if(error) {
        // for each element. details is an array of objects
        const msg = error.details.map(el => el.message).join('.')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }  
}

// is owner middleware

module.exports.isOwner = async(req, res, next) => {
    const {id} = req.params
    const foundCamp = await Campground.findById(id);
    // if owner of camp does not equal the userID in the request
    if (!foundCamp.owner.equals(req.user._id)){
        req.flash('error', 'You are not authorized to make changes')
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}


// middleware to validate reviews 
module.exports.validateReview = (req, res, next) => {
    const {error} = reviewJoiSchema.validate(req.body);
    if(error) {
        // for each element. details is an array of objects
        const msg = error.details.map(el => el.message).join('.')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }  

}