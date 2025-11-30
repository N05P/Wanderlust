class ExpressError extends Error{
    // @ts-ignore
    constructor(status,message){
        super();
        this.status=status;
        this.message=message;
    }
}

module.exports=ExpressError;