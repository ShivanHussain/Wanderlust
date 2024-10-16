const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/WrapAsync.js");
const { isLoggedIn, isOwner , validationlisting } = require("../middleware.js");
const listingcontroller = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });




router
    .route("/")
    .get(wrapAsync(listingcontroller.index))    //show route----show all listings--index-----------------------------
    .post( isLoggedIn, 
        upload.single("Listings[image]"),
        validationlisting, 
        wrapAsync(listingcontroller.createlisting));    //add new data in listings route-----------------------------------
   

router.get("/new", isLoggedIn,listingcontroller.rendernewform);  //create new listing route----------------------------------------------


router
    .route("/:id")
    .get( isLoggedIn, 
        wrapAsync(listingcontroller.showlisting))    //show route by id listings-------------------------------------------
    .put( isLoggedIn, 
        isOwner,
        upload.single("Listings[image]"),
        validationlisting,
        wrapAsync(listingcontroller.updatelisting))   //update the details in DB route--------------------------------
    .delete( isLoggedIn, 
        isOwner,
        wrapAsync(listingcontroller.deletelisting));   //delete route --- to delete listings------------------------------------




router.get("/:id/edit", 
    isLoggedIn, 
    isOwner,
    wrapAsync(listingcontroller.rendereditform));  //update the details in listings route----------------------------------------------



module.exports = router;