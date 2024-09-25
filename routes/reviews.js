// review routes using router

const express = require('express');
// mergeparams is required to have access to the ID insde the original route parameters
const router = express.Router({mergeParams: true});

// campground model
const Campground = require('../models/campground')

// require and use review model
const Review = require('../models/review');

// error functions
const catchError = require('../models/utils/wrapError')
const ExpressError = require('../models/utils/expressError')

// require middleware from the middlware file destructured
const {validateReview, needsLogin} = require('../middleware')



// post review on specific camp site
router.post('/', needsLogin, validateReview, catchError (async (req, res) => {
    const foundCamp = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    // push review into the campground array
    foundCamp.reviews.push(review);
    // save the review
    await review.save();
    // save the camp
    await foundCamp.save();
    req.flash('success', 'thank you for the review')
    res.redirect(`/campgrounds/${foundCamp._id}`);
}))

router.delete('/:reviewId', catchError(async (req, res,) => {
    // find the campground and delete the one review because its an array
    // the pull operator removes from an array instances of a values or values that match a condition
    // desctructiring id and reviewid from req.params
    const {id, reviewId} = req.params;
    // update the campground by passed ID
    // pull from the reviews array 
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
    
   
}))

module.exports = router;