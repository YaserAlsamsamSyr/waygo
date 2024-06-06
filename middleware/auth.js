const jwt=require('jsonwebtoken');
const mobile=(req,res,next)=>{
    try{
        const token=req.get('Authorization');
        if(!token){
            const err=new Error('please login to countinue');
            err.statusCode=401;
            throw err;
        }
        let decodedToken=jwt.verify(token,'mobileApp');
        if(!decodedToken){
            const err=new Error('please login to countinue');
            err.statusCode=401;
            throw err;
        }
        req.customerId=decodedToken.customerId;
        next();
    }catch(err){
        if(err.message=='jwt expired')
        {
           err.message="please login agen";
           err.statusCode=401;
        }
        if(!err.statusCode)
                 err.statusCode=500;
        next(err);
}
};
const company=(req,res,next)=>{
    try{
     const token=req.get('Authorization');
     if(!token){
        const err=new Error('please login to countinue');
        err.statusCode=401;
        throw err;
     }
     let decodedToken=jwt.verify(token,'companyApp');
     if(!decodedToken){
        const err=new Error('please login to countinue');
        err.statusCode=401;
        throw err;
     }
     req.mangerId=decodedToken.mangerId;
     next();
    }catch(err){
        if(err.message=='jwt expired')
             {
                err.message="please login agen";
                err.statusCode=401;
             }
        if(!err.statusCode)
           err.statusCode=500;
        next(err);
    }
};
const dashboard=(req,res,next)=>{
    try{
        const token=req.get('Authorization');
        if(!token){
            const err=new Error('please login to countinue');
            err.statusCode=401;
            throw err;
        }
        let decodedToken=jwt.verify(token,'dashboardApp');
        if(!decodedToken){
            const err=new Error('please login to countinue');
            err.statusCode=401;
            throw err;
        }
        req.adminId=decodedToken.adminId;
        next();
    }catch(err){
        if(err.message=='jwt expired')
        {
           err.message="please login agen";
           err.statusCode=401;
        }
        if(!err.statusCode)
          err.statusCode=500;
        next(err);
        }        
};
const web=(req,res,next)=>{
    try{
        const token=req.get('Authorization');
        if(!token){
            const err=new Error('please login to countinue');
            err.statusCode=401;
            throw err;
        }
        let decodedToken=jwt.verify(token,'webApp');
        if(!decodedToken){
            const err=new Error('please login to countinue');
            err.statusCode=401;
            throw err;
        }
        req.customerId=decodedToken.customerId;
        next();
    }catch(err){
        if(err.message=='jwt expired')
        {
           err.message="please login agen";
           err.statusCode=401;
        }
        if(!err.statusCode)
          err.statusCode=500;
        next(err);
        }        
};
module.exports={
    mobile,
    company,
    dashboard,
    web
};