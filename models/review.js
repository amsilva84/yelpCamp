// require mongoose
// const { number } = require('joi');
const mongoose = require('mongoose');
// require schema shorten
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    FunScale: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});


module.exports = mongoose.model('Review', reviewSchema);

