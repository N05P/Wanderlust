const express = require("express")
const router = express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync.js')
const {checkReview, isloggedin, checkAuthor} = require('../middleware.js')
const {newReview,destroyReview} = require('../controller/review.js')
// @ts-ignore


// Review data 
// @ts-ignore
router.post("/",checkReview,isloggedin,wrapAsync(newReview))


// Review Delete 
// @ts-ignore
router.delete("/:reviewId",isloggedin,checkAuthor,wrapAsync(destroyReview))

module.exports = router