const socket=require('../../webSocket').getSocket;
const DB=require('../../util/modelRequire');
const Op=require('sequelize').Op;
const validation=require('../../validation/methods');
const sendEmployeRequest=async(req,res,next)=>{
    const employeRequest=require('../../models/employeRequest');
    let empRequest=req.body;
    try{
        //validation
        let isTrue=await validation.isSrting(empRequest.name);
        if(isTrue!==true){
            const err=new Error(isTrue);
            err.statusCode=422;
            throw err;
        }
        isTrue=await validation.isPhoneNumber(empRequest.phone);
        if(isTrue!==true){
            const err=new Error(isTrue);
            err.statusCode=422;
            throw err;
        }
        isTrue=await validation.isSrting(empRequest.address);
        if(isTrue!==true){
            const err=new Error(isTrue);
            err.statusCode=422;
            throw err;
        }
        isTrue=await validation.isComment(empRequest.homework);
        if(isTrue!==true){
            const err=new Error(isTrue);
            err.statusCode=422;
            throw err;
        }
        //
        let newEmpReq=await employeRequest.create(empRequest);
        if(!newEmpReq){
            const err=new Error('there is an error');
            err.statusCode=403;
            throw err;
        }
        empRequest.id=newEmpReq.id;
        socket().emit('employeRequest',{employeRequest:empRequest});
        res.status(201).json({message:"send success"});
    }catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};
const sendAddCompanyRequest=async(req,res,next)=>{
    try{
        let newCompanyRequest=req.body;
        //validation
        let isTrue=await validation.isSrting(newCompanyRequest.name);
        if(isTrue!==true){
            const err=new Error(isTrue);
            err.statusCode=422;
            throw err;
        }
        isTrue=await validation.isPhoneNumber(newCompanyRequest.phone);
        if(isTrue!==true){
            const err=new Error(isTrue);
            err.statusCode=422;
            throw err;
        }
        isTrue=await validation.isSrting(newCompanyRequest.address);
        if(isTrue!==true){
            const err=new Error(isTrue);
            err.statusCode=422;
            throw err;
        }
        isTrue=await validation.isListOfCities(newCompanyRequest.cities);
        if(isTrue!==true){
            const err=new Error(isTrue);
            err.statusCode=422;
            throw err;
        }
        //
        let newComReq=await require('../../models/companyRequest').create(newCompanyRequest);
        if(!newComReq){
            const err=new Error("there is a problem");
            err.statusCode=422;
            throw err;   
        }
        newCompanyRequest.id=newComReq.id;
        socket().emit('companyRequest',{companyRequest:newCompanyRequest});
        res.status(201).json({message:"send success"});
    }catch(err){
        if(!err.statusCode)
           err.statusCode=500;
        next(err);
    }
};
const searchFroTrips=async(req,res,next)=>{
    const from=req.body.from;
    const to=  req.body.to;
    var dateFromCustomer=req.body.date;
    let date=new Date(dateFromCustomer);
    try{
        //validation
        let allStringArr=[from,to];
        let isTrue=true;
        for(let i=0;i<allStringArr.length;i++){
            isTrue=await validation.isSrting(allStringArr[i]);
            if(isTrue!==true){
                const err=new Error(isTrue);
                err.statusCode=422;
                throw err;
            }
        }
        isTrue=await validation.isDate(dateFromCustomer);
        if(isTrue!==true){
            const err=new Error(isTrue);
            err.statusCode=422;
            throw err;
        }
        //
        let trips="";
            trips=await DB.trip.findAll({
                where: {
                    date: {
                      [Op.gt]: date,
                    },
                  },
                include:[{
                    model:DB.companyy,
                    attributes:['name','image']
                },{
                    model:DB.bus,
                    attributes:[
                        'id','type','numOfSets','numberOfBus','driverName','helpDriverName'
                    ]
                },{
                    model:DB.cityy,as:'from',
                    attributes:['name'],
                    where:{name:from}
                },{
                    model:DB.cityy,as:'to',
                    attributes:['name'],
                    where:{name:to}
                }]
            });
        if(trips.length==0){
            trips=[]; 
            res.status(200).json({
                trips:trips
            });
        } else {
            trips=trips.map(i=>({
                            id:i.id,
                            companyName:i.company.name,
                            companyImage:i.company.image,
                            from:i.from.name,
                            to:i.to.name,
                            bus:{
                                    id:i.bus.id,
                                    type:i.bus.type,
                                    numOfSets:i.bus.numOfSets,
                                    numberOfBus:i.bus.numberOfBus,
                                    driverName:i.bus.driverName,
                                    helpDriverName:i.bus.helpDriverName
                            },
                            ticktPrice:i.ticktPrice,
                            date:i.date
            }));
            let t=[];
            for(let i=0;i<trips.length;i++){
                if(
                    date.getFullYear()==trips[i].date.getFullYear() &&
                    date.getMonth()==trips[i].date.getMonth() &&
                    date.getDate()==trips[i].date.getDate()
                )
                t.push(trips[i]);
            }
            res.status(200).json({
               trips:t
            });
        }
    }catch(err){
        if(!err.statusCode)
           err.statusCode=500;
        next(err);
    }
};
module.exports={
    sendAddCompanyRequest,
    sendEmployeRequest,
    searchFroTrips
};