// this is a DB seed file!!!!

// import array from cities
const cities = require('./cities');

// import from seedhelpers descriptors and places:
const {places, descriptors} = require('./seedHelpers')

// Moongoose and models requirements

const mongoose = require('mongoose');
const Campground = require('../models/campground')
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/yelpCamp');
}

// grab random element from array from seedhelpers file using a function
const seedHelpers = array => array[Math.floor(Math.random() * array.length)]


const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i < 50; i++) {
        const randomCity = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20 + 10);
        const camp = new Campground({
            owner: '66edd7e4200f1c501454e081',
            location: `${cities[randomCity].city}, ${cities[randomCity].state}`,
            tittle: `${seedHelpers(descriptors)} ${seedHelpers(places)}`,
            image: 'https://unsplash.com/photos/brown-shed-beside-body-of-water-F9mS-WvICRg/1600x900',
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cumque sit cum exercitationem, impedit beatae commodi dignissimos quia quos magni consequuntur, perspiciatis dicta architecto atque deleniti. Molestias excepturi inventore maxime quaerat.',
            price
        })
        await camp.save();
    }
   
}


seedDB().then(() => {
    mongoose.connection.close()
})