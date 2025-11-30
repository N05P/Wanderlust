const Listing = require('../models/listing')
const ExpressError = require('../utils/ExpressError')

// @ts-ignore
module.exports.index = async (req, res) => {
  const data = await Listing.find({});
  res.render("index.ejs", { data });
}

// @ts-ignore
module.exports.newlisting = (req, res) => {
  console.log(req.params)
  res.render("new.ejs");
}

// @ts-ignore
module.exports.addnewlisting = async (req, res, next) => {
  const url = req.file.path;
  const filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  // @ts-ignore
  newListing.owner = req.user._id;
  // @ts-ignore
  newListing.image={url,filename}
  await newListing.save();
  req.flash("success", "New Listing is added")
  res.redirect("/listings");
}

// @ts-ignore
module.exports.show = async (req, res, next) => {
  const { id } = req.params;
  const data = await Listing.findById(id).populate({
    path: "reviews",
    populate: {
      path: "author"
    }
  })
    .populate('owner');
  if (!data) {
    req.flash("error", "Listings not found")
    return res.redirect('/listings')
  }
  res.render("show.ejs", { data });
}

// @ts-ignore
module.exports.getEditform = async (req, res) => {
  const { id } = req.params;
  const data = await Listing.findById(id);
  if (!data) throw new ExpressError(404, "Listing not found");
  res.render("edit.ejs", { data });
}

// @ts-ignore
module.exports.getEdited = async (req, res) => {
  const { id } = req.params;
  const updated = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

  if(typeof req.file!=='undefined'){
  const url = req.file.path;
  const filename = req.file.filename;
  // @ts-ignore
  updated.image={url,filename}
  await updated?.save()
  }

  if (!updated) throw new ExpressError(404, "Listing not found");
  res.redirect("/listings");
}

// @ts-ignore
module.exports.destroy = async (req, res) => {
  const { id } = req.params;
  const deleted = await Listing.findByIdAndDelete(id);
  req.flash("success","Listings got deleted")
  if (!deleted) throw new ExpressError(404, "Listing not found");
  res.redirect("/listings");
}