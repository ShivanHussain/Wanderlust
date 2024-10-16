if(process.env.NODE_ENV != "production"){
    require ('dotenv').config();

}

const express =require("express");
const app =express();
const mongoose =require("mongoose");
const path = require("path");
const methodoverride = require("method-override");
const ejsmate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingsroute = require("./routes/listing.js");
const reviewsroute = require("./routes/review.js");
const session = require("express-session");
const mongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userroute = require("./routes/user.js");
const MongoStore = require('connect-mongo');




let port = 8080;
//let mongo_url ="mongodb://127.0.0.1:27017/airbnb";
const dbUrl = process.env.ATLASDB_URL;


main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log("some error to connect DB",err);
})
async function main() {
    await mongoose.connect(dbUrl)
    
};


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodoverride("_method"));
app.engine("ejs",ejsmate);
app.use(express.static(path.join(__dirname,"/public")));


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("error in mongo session store",err);

});

const sesssionoption = {
    store,
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }, 
};


/*to check connection------> via root method
app.get("/", (req, res)=>{
    res.send("Request is successfull");
});
*/


app.use(session(sesssionoption));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next)=>{
    res.locals.success_messages = req.flash("success");
    res.locals.error_messages = req.flash("error");
    res.locals.curruser  = req.user;
    next();
});


/*app.get("/demouser", async (req, res)=>{
    let fakeuser = new User({
        email: "student@gmail.com",
        username: "hello world"
    }); 

    let registeruser = await User.register(fakeuser,"helloworld123");
    console.log(registeruser);
    res.send(registeruser);

});
*/




app.use("/listings",listingsroute);
app.use("/listings/:id/review", reviewsroute );
app.use("/",userroute);




app.all("*",(req, res, next)=>{
    next( new ExpressError(404,"page not found"));
   // res.status(404).send("Page not found");
})

app.use((err, req, res, next)=>{
    //let {status, message} = err;
    //res.status(status).send(message);
    res.render("error.ejs",{ err });

    //res.send("something went wrong");
});
app.listen(port, ()=>{
    console.log("server is liten to port 8080");
});


