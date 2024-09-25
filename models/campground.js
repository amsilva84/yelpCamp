// moongoose model requirements
const mongoose = require('mongoose');
// review is required for the delete review function to work 
const Review = require('./review')

// moongoose schema requirements 

    // this is a way to shorten typing|  const camgpgroundSchema = new moongoose.Schema({
const Schema = mongoose.Schema; 

// one to many relationship setup with reviews and user model
const camgpgroundSchema = new Schema({
    tittle: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]

})

// delete reviews when deleting a campground from the database
// this function passes the document that was deleted
// deletes everything from the reviews array if its found
// the id for each review is "$in" doc.reviews

camgpgroundSchema.post('findOneAndDelete', async function (doc) {
    if(doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

// compile and export schema
module.exports = mongoose.model('Campground', camgpgroundSchema);




