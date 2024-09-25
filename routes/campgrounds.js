// express router for campground routes
const express = require('express');
const router = express.Router();

// campground model
const Campground = require('../models/campground')

// error functions
const catchError = require('../models/utils/wrapError.js');
// const ExpressError = require('../models/utils/expressError')

// require all those middlewares from the middlware file
const {needsLogin, isOwner, validateCampground} = require('../middleware.js')

// // require joi campgraound schema. Desctructured
const {campgroundJoiSchema} = require('../schemas.js');






 // get all campgrounds
router.get('/', catchError (async (req, res) => {
    const campgrounds = await Campground.find({}); 
    res.render('campgrounds/index', { campgrounds })
 }))


 // create a new campground. needs to go here first before the route below-----
//  this is using the needsLogin middleware to ensure the user is logged in before creating new campground
router.get('/new', needsLogin, (req, res) => {
    res.render('./campgrounds/new')
    })

  
// using function from wrapError file and the function to catch all errors without try and catch. the function has next to pass it to the next route
router.post('/', needsLogin, validateCampground, catchError (async (req, res) => {
    // if nothing in the req.body.campground throw new error and pass it to next using the catcherror function
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400)
    // this is the Joi schema validator for campground tittle/price/etc
    
    const newCamp = new Campground(req.body.campground);
    // save the logged in user to the campground owner
    newCamp.owner = req.user._id;
    await newCamp.save();
    // flash message
    req.flash('success', 'Successfully created campground!')
    console.log(newCamp);
    res.redirect(`/campgrounds/${newCamp._id}`)
    
}))

// edit a campground ------------------

router.get('/:id/edit', needsLogin, isOwner, catchError (async (req, res, next) => {
    const { id }  = req.params;
    const foundCamp = await Campground.findById(id)
    if (!foundCamp){
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { foundCamp })
 }))

//  this route is to update the product from above route
router.put('/:id', needsLogin, isOwner, validateCampground, catchError (async(req, res) => {
//     // grabs the id from req.parameters 
    const { id }  = req.params;
//     // this findbyidand update is a quick way of updating the info. runValidators has to be enabled for the schema rules to apply
    const foundCamp = await Campground.findByIdAndUpdate(id, {...req.body.foundCamp})
    req.flash('success, Successfully updated campground')
   res.redirect(`/campgrounds/${foundCamp._id}`)
}))



// ---------------------------------------------------------------
    //show details for campground by using ID and "populate" the review section
router.get('/:id', catchError (async (req, res) => {
    const { id  } = req.params;
    const foundCamp = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('owner');
    console.log(foundCamp);
    if (!foundCamp) {
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds')
    }
    // if(!Campground.findById) throw new ExpressError('Invalid Campground ID or path', 400)
    res.render('campgrounds/details', {foundCamp})
}))


// delete -------------------------------
router.delete('/:id', needsLogin, isOwner, catchError (async (req, res) => {
    const { id }  = req.params;
    const deleteCamp =  await Campground.findByIdAndDelete(id)
    req.flash('success', 'Campground was deleted')
    res.redirect('/campgrounds');
}))

module.exports = router;