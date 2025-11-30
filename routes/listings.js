const express = require("express");
const route = express.Router();
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isloggedin} = require('../middleware.js')
const {authorizedUser} = require('../middleware.js')
const {checkValidator} = require('../middleware.js')
const listingController = require('../controller/listings.js')
const multer = require('multer')
const {storage} = require('../cloudConfigure.js');
const uploads = multer({storage})

route.route('/')
  .get(
// @ts-ignore
  wrapAsync(listingController.index))
  .post(
    isloggedin,
    uploads.single('listing[image]'),
    
// @ts-ignore
  wrapAsync(listingController.addnewlisting)
);



// Form to create new listing
route.get("/new",isloggedin, listingController.newlisting);


// Show single listing
route.get(
  "/:id",
// @ts-ignore
  wrapAsync(listingController.show)
);



// Edit form
route.get(
  "/:id/edit",isloggedin,
// @ts-ignore
  wrapAsync(listingController.getEditform)
);

// Update listing
route.put(
  "/:id",
  authorizedUser,
  uploads.single('listing[image]'),
  checkValidator,
// @ts-ignore
  wrapAsync(listingController.getEdited)
);

// Delete listing
route.delete(
  "/:id",isloggedin,authorizedUser,
// @ts-ignore
  wrapAsync(listingController.destroy)
);

module.exports = route;