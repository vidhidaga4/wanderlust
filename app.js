if(process.env.NODE_ENV!= "production"){
    require("dotenv").config();
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require('path');
const methodOverride=require("method-override");
const ejsMate= require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
})
async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine",'ejs')   //to use ejs
app.set("views",path.join(__dirname,"/views"))  //to use ejs
app.use(express.urlencoded({extended:true})); //for parsing of post data that we get from form
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

//sessions and flash
const sessionOptions = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now()+ 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

// app.get("/",(req,res)=>{
//     res.send("Hi, I am root");
// })

app.use(session(sessionOptions));
app.use(flash());

//A middle ware that initilaise passport
app.use(passport.initialize());
//passoprt session to store info of one user at mutltiple pages
app.use(passport.session());
//use static authenticate method of local starategy
passport.use(new LocalStrategy(User.authenticate()));
//use static serialize and deserialize methods
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//flash middleware
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

// app.get("/demouser", async(req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"delta-student",
//     });

//     let registeredUser = await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// })

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

//error handling middleware
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
});

//error handling middleware
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong!"}=err;
    res.status(statusCode).render("error.ejs",{err});
    //res.status(statusCode).send(message);
});

app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});