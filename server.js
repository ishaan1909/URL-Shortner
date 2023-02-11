// Node.js is an open-source and cross-platform runtime environment 
// it is built on Chrome's V8 JavaScript engine
const express = require("express");
// requiring moongoose now : library that creates a connection between MongoDB and the Node.js 
const mongoose = require("mongoose");
//All the moongose Schemas are to be kept inside the models folder -- requiring the schema now 
const shortUrl = require("./models/shortUrl");

/*
Calls the express function "express()" and puts new Express application inside the app variable 
It's something like you are creating an object of a class.
*/
const app = express();
// strictQuery = true then run through Mongoose, it's not enforced in the mongoDB side, your documents remain schemaless.
mongoose.set('strictQuery', false); // due to deprication warning

// here we are connecting to the local mongoDB database so to do so 
mongoose.connect('mongodb://localhost/urlShortner',{ //urlShortner is any name that we can give to our database
    // we can remove both the options below still the code will run
    useNewUrlParser:true , useUnifiedTopology:true // useUnifiedTopology This means failed operations will fail faster, with more accurate stack traces and specifics about the failure.
}) // mongodb used two types of urls mongodb+srv:// and mongodb:// by making the useNewUrlParser:true then we are dropping support for old type of URL 

app.set("view engine","ejs"); // A template engine enables you to use static template files in your application. Here we are using the ejs view engine

app.use(express.urlencoded({extended:false})) //we are using url parameters urlencoder is used to parse the parameters which are present in the req and response

//here we are posting the resonse to the root of the webpage
app.post('/',async(req,res)=>{
  // for the col full passing the req.body.(same name as that in the form ejs file)
  //this is a async function i.e. it is running in the background so we have tow wait until it is completed so we write await 
  await shortUrl.create({full:req.body.fullUrl}) // here creating a shortUrl using the .create function which is a part of mongoDB
    res.redirect("/")  // if not written then the screen keeps on buffering not showing the output   
})

app.get("/",async (req,res)=>{
    const shortUrls= await shortUrl.find(); // here we get all the shortUrls inside the const so 'shortUrls' is now an array. 
    // here using the render instead of send as we are trying to render a view and also pass the render object 
    res.render('index',{shortUrls:shortUrls.slice(-1)}); // -1 as we are trying to send the last element of the array 
})

//this get request is for when we click the link in the page we are redirected to the desired webpage

app.get('/:shortUrl',async(req,res)=>{ // '/:shortUrl' here we are saying anything after / but it must be stored in shortUrl 
    const ShortUrl = await shortUrl.findOne({short:req.params.shortUrl}) // this returns the onject which has the same shortUrl that we passed 
    if(ShortUrl==null) // if the object is null then just pass 404
        return res.sendStatus(404);
    ShortUrl.clicks++; // increment the clicks value by one 
    ShortUrl.save();// save the clicks in the webpage

    res.redirect(ShortUrl.full); // the object has a parameter called full which contains the full url
})
// here the app i.e. the express() object is listening to local host 5000 and after deployment it will listen to whatever is the env variable for PORT
app.listen(process.env.PORT || 5000);