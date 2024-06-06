const employeRequest=require('../../../models/employeRequest');

const getEmployeRequest=async(req,res,next)=>{
    try{
        const employeRequests=await employeRequest.findAll({attributes:[
            'id',
            'name',
            'phone',
            'address',
            'homework'
        ]});
        if(employeRequests.length==0){
            const err=new Error('there are no requsts');
            err.statusCode=404;
            throw err;
        }
        res.status(200).json({employeRequests:employeRequests});
    }catch(err){
        if(!err.statusCode)
             err.statusCode=500;
        next(err);
    }
};
const deleteEmployeRequest=async(req,res,next)=>{
    const employeeId=req.params.id;
    try{
        //validation
        let validation=require('../../../validation/methods');
        let isTrue=await validation.isnumber(employeeId);
        if(isTrue!==true){
            const err=new Error(isTrue);
            err.statusCode=422;
            throw err;
        }
        //
        if(!await employeRequest.destroy({where:{id:employeeId}})){
            const err=new Error('this request not found');
            err.statusCode=404;
            throw err;
        }
        let requests=await employeRequest.findAll({attributes:[
            'id',
            'name',
            'phone',
            'address',
            'homework'
        ]});
        res.status(200).json({employeRequests:requests});
    }catch(err){
        if(!err.statusCode)
             err.statusCode=500;
        next(err);
    }
};
module.exports={
    getEmployeRequest,
    deleteEmployeRequest
};