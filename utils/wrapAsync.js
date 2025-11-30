// @ts-ignore
module.exports = (fn)=>{
    // @ts-ignore
    return function(req,res,next){
        // @ts-ignore
        fn(req,res).catch((err)=>next(err))
    }
}