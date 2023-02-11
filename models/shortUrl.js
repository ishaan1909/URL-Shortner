const mongoose = require('mongoose');
// npm package called shortid is used to create a shortid
// first installed this npm package from cmd
const shortId = require('shortid'); //this package is used to generate the short identifiers using the generate method
// this moongose.Schema takes in an object which has the cols 
const shortUrlSchema = new mongoose.Schema({
    full:{
        type:String,
        required:true
    },
    short:{
        type:String,
        required:true,
        default : shortId.generate // this is a function so same as ()=>shortId.generate()
    },
    clicks:{
        required:true,
        type:Number,
        default:0
    }
})

// .model(name_of_model,name_of_schema)
module.exports = mongoose.model('shortUrl',shortUrlSchema); //this has to be imported in server.js  