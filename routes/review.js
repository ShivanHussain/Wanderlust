const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/WrapAsync.js");
const { validationreview, isLoggedIn, isreviewauthor }= require("../middleware.js");
const reviewcontroller = require("../controllers/review.js");



//post review route-------------------------
router.post("/",
    isLoggedIn,
    validationreview,
     wrapAsync(reviewcontroller.createreview));

//delete review route----------------------
router.delete("/:reviewid",
    isLoggedIn, 
    isreviewauthor,
    wrapAsync(reviewcontroller.deletereview));


module.exports = router;
