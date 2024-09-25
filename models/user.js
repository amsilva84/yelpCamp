const mongoose = require('mongoose');
const Schema = mongoose.Schema; 
// require passport local auth
const passportLocalMongoose = require('passport-local-mongoose');

// no need to add username password to the schema. the plugin below takes care of that
const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    }
});

// there is no need for username/password this plugin takes care of it
UserSchema.plugin(passportLocalMongoose)

// compile the model
module.exports = mongoose.model('User', UserSchema);