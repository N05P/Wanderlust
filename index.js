require('dotenv').config()
console.log(process.env.CLOUD_NAME)

// app.js
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require('./routes/listings')
const reviewRouter = require('./routes/reviews')
const userRouter = require('./routes/user.js')


const cookieParser = require("cookie-parser")
const session = require('express-session')
const MongoStore = require('connect-mongo')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user.js')

const app = express();
const port = 9090;

// ---------- Database Connection ----------
async function main() {
  try {

    // @ts-ignore
    await mongoose.connect(process.env.DB_CONNECTION,{
      dbName:'Wanderlust'
    });
    console.log("✅ MongoDB connection established");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
}
main();



// ---------- App Configuration ----------

const store = MongoStore.create({
  mongoUrl:process.env.DB_CONNECTION,
  crypto:{
    // @ts-ignore
    secret:process.env.MY_SECRET,
  },
  touchAfter:24 * 3600
});

const sessionOption = {
  store,
  secret:process.env.MY_SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now() + 7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httponly:true
  },
}
// @ts-ignore

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cookieParser());



// @ts-ignore
app.use(session(sessionOption))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
// @ts-ignore
passport.use(new LocalStrategy(User.authenticate()));
// @ts-ignore
passport.serializeUser(User.serializeUser());
// @ts-ignore
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success = req.flash('success');
  res.locals.failure = req.flash("error")
  res.locals.curuser = req.user;
  next();
})

// ---------- ROUTES ----------

// Home route


// app.get("/every",async(req,res)=>{
//   const user1 = new User({
//     email:"pn545@gmail.com",
//     username:"manohar"
// })
//  let newUser = await User.register(user1,"everythingisok")
//   res.send(newUser)
// })

app.use('/listings',listingRouter)
app.use('/listings/:id/review',reviewRouter)
app.use('/',userRouter);

app.get("/", (req, res) => {
  res.redirect('/listings')
});

// ---------- 404 Handler ----------
app.use( (req, res, next) => {  
    next(new ExpressError(404,"Page Not Found"))
});

// ---------- Error Handling Middleware ----------
// @ts-ignore
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.render("error.ejs",{status,message})
});

// ---------- Start Server ----------
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
