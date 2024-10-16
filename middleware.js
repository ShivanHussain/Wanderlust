const Listing = require("./models/listing");
const Review = require("./models/review.js")
const ExpressError = require("./utils/ExpressError.js");
const { listingschema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in to create a new listing");
        return res.redirect("/login");
    }
    next();
};



module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();

};


module.exports.isOwner = async (req, res, next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.curruser._id)){
        req.flash("error","You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();

};



//validation listing of server side ----------------------------------- 
module.exports.validationlisting = (req, res, next)=>{
    let { err } = listingschema.validate(req.body);
    if(err){
        let errmsg = err.details.map((el) => el.message).join();
        throw new ExpressError(400,errmsg);
    }
    else{
        next();
    }
};


//validation review of server side----------------------------
module.exports.validationreview = (req, res, next)=>{
    let { err } = reviewSchema.validate(req.body);
    if(err){
        let errmsg = err.details.map((el) => el.message).join();
        throw new ExpressError(400,errmsg);
    }
    else{
        next();
    }
};



module.exports.isreviewauthor = async (req, res, next)=>{
    let { id, reviewid } = req.params;
    let review = await Review.findById(reviewid);
    if(!review.author.equals(res.locals.curruser._id)){
        req.flash("error","You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();

};
