const User = require("../models/user");
module.exports.rendersignupform = (req, res)=>{
    res.render("users/signup.ejs");

};

module.exports.signup = async (req, res)=>{
    try{
        let { username, email, password } = req.body;
        const newuser = new User({ username, email });
        const registeruser =  await User.register(newuser,password);
        console.log(registeruser);
        req.login(registeruser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Wandlust!");
            res.redirect("/listings");
        });
        
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }

};


module.exports.renderloginform = (req, res)=>{
    res.render("users/login.ejs");
    
};

module.exports.login = async (req, res)=>{
    req.flash("success", "Welcome back to Wandlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);

};
 
module.exports.logout =  (req, res, next)=>{
    req.logOut((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/listings");
    })
};