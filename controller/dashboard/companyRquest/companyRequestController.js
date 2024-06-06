const getCompanyRequest=async(req,res,next)=>{
    try{
    const companyRequests=await require('../../../models/companyRequest').findAll({
        attributes:[
            'id',
            'name',
            'phone',
            'address',
            'cities'
        ]
    });
    if(companyRequests.length==0){
        const err=new Error('no company requests found');
        err.statusCode=404;
        throw err;
    }
    res.status(200).json({companyRequests:companyRequests});
    }catch(err){
        if(!err.statusCode)
             err.statusCode=500;
        next(err);
    }
};
const deleteCompanyRequest=async(req,res,next)=>{
    const companyRequestId=req.params.id;
    try{    
        //validation
        let validation=require('../../../validation/methods');
        let isTrue=await validation.isnumber(companyRequestId);
        if(isTrue!==true){
            const err=new Error(isTrue);
            err.statusCode=422;
            throw err;
        }
        //
        const comReq=require('../../../models/companyRequest');
        if(!await comReq.destroy({where:{id:companyRequestId}})){
            const err=new Error('this company request not found');
            err.statusCode=404;
            throw err;
        }
        let companyRequests=await comReq.findAll({
            attributes:[
                'id',
                'name',
                'phone',
                'address',
                'cities'
            ]
        });
        res.status(200).json({companyRequests:companyRequests});
    }catch(err){
        if(!err.statusCode)
             err.statusCode=500;
        next(err);
    }
};
module.exports={
    getCompanyRequest,
    deleteCompanyRequest
};