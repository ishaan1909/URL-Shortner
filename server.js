const express = require("express");
const mongoose = require("mongoose");
// const bodyParser = require('body-parser')
const shortUrl = require("./models/shortUrl");


const app = express();
// app.use(bodyParser.urlencoded({ extended: false }))
mongoose.set('strictQuery', false); // due to deprication warning
mongoose.connect('mongodb://localhost/urlShortner',{
    useNewUrlParser:true , useUnifiedTopology:true
})

app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}))
app.post('/shortUrl',async(req,res)=>{
   await shortUrl.create({full:req.body.fullUrl})
    res.redirect("/")    
})
app.get("/",async (req,res)=>{
    const shortUrls= await shortUrl.find();
    res.render('index',{shortUrls:shortUrls.slice(-1)});
})

app.get('/:shortUrl',async(req,res)=>{
    const ShortUrl = await shortUrl.findOne({short:req.params.shortUrl})

    if(ShortUrl==null)
        return res.sendStatus(404);
    ShortUrl.clicks++;
    ShortUrl.save();

    res.redirect(ShortUrl.full);
})
app.listen(process.env.PORT || 5000);