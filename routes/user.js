const express = require("express");
const route = express.Router();
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const {  setlocals } = require("../middleware");
const {sign,signform,login,loginform,logout} = require('../controller/user')

route.get('/sign',signform)

// @ts-ignore
route.post('/sign',wrapAsync(sign))

route.get('/login',loginform)

route.post('/login',setlocals,passport.authenticate('local',{failureRedirect:'/login',failureFlash:true}),login
)

route.get('/logout',logout)

module.exports = route;