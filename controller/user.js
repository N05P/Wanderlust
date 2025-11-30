const User = require('../models/user');

// @ts-ignore
module.exports.sign = async(req,res,next)=>{
    try{
    const {email,username,password} =  req.body;
    const data = new User({
        email,username
    })
    const userdata = await User.register(data,password)
    // @ts-ignore
    req.login(userdata,(err)=>{
        if(err){
            next(err)
        }
        req.flash("success",`Welcome, ${username}`)
        res.redirect('/listings')
    })
    
}
catch(error){
    // @ts-ignore
    req.flash("error",error.message)
    res.redirect('/sign')
}
}

// @ts-ignore
module.exports.signform = (req,res)=>{
    res.render('user/sign')
}


// @ts-ignore
module.exports.loginform = (req,res)=>{
    res.render('user/login')
}

// @ts-ignore
module.exports.login = (req,res)=>{
    const {username} = req.body;
    req.flash('success',`Welcome back, ${username}`)
    const redirectUrl = res.locals.reurl || '/listings'
    res.redirect(redirectUrl)
}

// @ts-ignore
module.exports.logout = (req,res)=>{
    // @ts-ignore
    req.logOut((err)=>{
        if(err){
            console.log(err)
        }
        req.flash('success','User logged out')
        res.redirect('/listings')
    })
}