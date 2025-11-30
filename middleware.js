const Listing = require('./models/listing')
const {checkSchema} = require("./schema.js")
const ExpressError = require("./utils/ExpressError.js");
const {checkReviews} = require('./schema.js');
const Review = require('./models/review.js')


// @ts-ignore
module.exports.isloggedin = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","User must be login")
        return res.redirect('/login')
    }
    next()
}

// @ts-ignore
module.exports.setlocals = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.reurl = req.session.redirectUrl
    }
    next()
}

// @ts-ignore
module.exports.authorizedUser = async(req,res,next)=>{
    const { id } = req.params;
    const data = await Listing.findById(id);
    if(data){
    // @ts-ignore
    if(!data?.owner._id.equals(req.user._id)){
      req.flash("error",'You are not allowed to change anything')
      return res.redirect('/listings')
    }
  }
  next()
}

// @ts-ignore
module.exports.checkAuthor = async(req,res,next)=>{
    const {id,reviewId} = req.params;
    const data = await Review.findById(reviewId);
    if(data){
    // @ts-ignore
    if(!data?.author._id.equals(req.user._id)){
      req.flash("error",'You are not allowed to change anything')
      return res.redirect(`/listings/${id}`)
      console.log(req)
    }
  }
  next()
}

// @ts-ignore
module.exports.checkValidator = (req,res,next)=>{
  const {error} = checkSchema.validate(req.body)
    if(error){
      console.log(error)
      throw new ExpressError(500,error)
    }
    else{
      next()
    }
}

// @ts-ignore
module.exports.checkReview = (req,res,next)=>{
  const {error} = checkReviews.validate(req.body)
  if(error){
    throw new ExpressError(500).message(error)
  }
  else{
    next()
  }
}