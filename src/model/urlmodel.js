const mongoose = require('mongoose')



const urlSchma = new mongoose.Schema({
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
        trim:true
    },
    shortUrl: {
        type: String,
        require: true,
        unique: true,
        trim:true
    }
},
{ timestamps: true });


module.exports = mongoose.model("url", urlSchma);






// { urlCode: { mandatory, unique, lowercase, trim }, longUrl: {mandatory, valid url}, shortUrl: {mandatory, unique} }