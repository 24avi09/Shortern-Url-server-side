const mongoose = require('mongoose')
// var validUrl = require('valid-url');
// const validUrl = validUrl.isUri()


const urlSchma = mongoose.Schema({
    urlCode: {
        type: String,
        require: true,
        unique: true,
        lowercase:true,
        trim: true
    },
    longUrl: {
        type: String,
        require: true,
    },
    shortUrl: {
        type: String,
        require: true,
        unique: true
    }
},
{ timestamps: true });


module.exports = mongoose.model("url", urlSchma);






// { urlCode: { mandatory, unique, lowercase, trim }, longUrl: {mandatory, valid url}, shortUrl: {mandatory, unique} }