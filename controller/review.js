const Listing = require("../models/listing.js");
const Review = require('../models/review.js')
const ExpressError = require("../utils/ExpressError.js");

// @ts-ignore
module.exports.newReview = async(req,res)=>{
  const listings = await Listing.findById(req.params.id)
  const newReview = new Review(req.body.review);
 
  if(!listings){
    throw new ExpressError(500).message("Data not found")
  }

  // @ts-ignore
  newReview.author = req.user._id;
  // @ts-ignore
  listings.reviews.push(newReview._id)
  
  if(newReview){
    req.flash('success',"New Review added")
  }
  newReview.save();
  listings.save();

  res.redirect(`/listings/${req.params.id}`)
}

// @ts-ignore
module.exports.destroyReview = async(req,res)=>{
  const {id,reviewId} = req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
  await Review.findByIdAndDelete(reviewId)
  req.flash("success","Review got deleted")
  res.redirect(`/listings/${id}`)
}