const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,validateReview,isReviewAuthor} = require("../middleware.js")
const reviewController = require("../controllers/reviews.js");



//Reviews
//Post Review Route
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//POST DELETE ROUTE
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,reviewController.destroyReview);

module.exports = router;