const checkDate=require('../../../middleware/checkDate');
const DB=require('../../../util/modelRequire');
const validation=require('../../../validation/methods');
const getBuses=async(req,res,next)=>{
       const mangerId=req.mangerId;
       try{
        //validation
        let isTrue=await validation.isnumber(mangerId);
        if(isTrue!==true){
            const err=new Error(isTrue);
            err.statusCode=422;
            throw err;
        }
        //
        let getBuses=await DB.employee.findOne({
                where:{id:mangerId},
                attributes:['id'],
                include:{
                    model:DB.companyy,
                    attributes:['id'],
                    include:{
                        model:DB.bus,
                        attributes:[
                            'id',
                            'type',
                            'numOfSets',
                            'driverName',
                            'helpDriverName',
                            'numberOfBus',
                        ],
                        include:{
                            model:DB.trip,
                            attributes:[
                                'id',
                                'ticktPrice',
                                'date',
                            ],
                            include:[
                                {model:DB.cityy,as:'from',attributes:['name']},
                                {model:DB.cityy,as:'to',attributes:['name']}
                            ]
                        }
                    }
                }
            });
            if(getBuses.company.buses.length==0){
                    const err=new Error('no buses found');
                    err.statusCode=404;
                    throw err;
            }
            getBuses=getBuses.company.buses;
            let buses=[];
            for(let i=0;i<getBuses.length;i++){
                    buses[i]={
                        'id':getBuses[i].id,
                        'type':getBuses[i].type,
                        'numOfSets':getBuses[i].numOfSets,
                        'driverName':getBuses[i].driverName,
                        'helpDriverName':getBuses[i].helpDriverName,
                        'numberOfBus':getBuses[i].numberOfBus,
                        'oldTrip':[],
                        'newTrip':[]
                    };
                    for(let j=0;j<getBuses[i].trips.length;j++)
                            checkDate(getBuses[i].trips[j].date)?
                                buses[i].newTrip.push({
                                    'id':getBuses[i].trips[j].id,
                                    'ticktPrice':getBuses[i].trips[j].ticktPrice,
                                    'date':getBuses[i].trips[j].date,
                                    'from':getBuses[i].trips[j].from.name,
                                    'to':getBuses[i].trips[j].to.name
                                })
                            :
                                buses[i].oldTrip.push({
                                    'id':getBuses[i].trips[j].id,
                                    'ticktPrice':getBuses[i].trips[j].ticktPrice,
                                    'date':getBuses[i].trips[j].date,
                                    'from':getBuses[i].trips[j].from.name,
                                    'to':getBuses[i].trips[j].to.name
                                })
                            ;
            }
            res.status(200).json({buses:buses});
       }catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
       }
};
const addBus=async(req,res,next)=>{
    const type          =req.body.type          ;
    const numOfSets     =req.body.numOfSets     ;
    const driverName    =req.body.driverName    ;
    const helpDriverName=req.body.helpDriverName;
    const numberOfBus   =req.body.numberOfBus   ;
    const mangerId      =req.mangerId           ;
    try{
    //validation
    let allStringArr=[type,driverName,helpDriverName];
    let allNumberArr=[numOfSets,numberOfBus,mangerId];
    for(let i=0;i<allStringArr.length;i++){
        let isTrue=await validation.isSrting(allStringArr[i]);
        if(isTrue!==true){
           const err=new Error(isTrue);
           err.statusCode=422;
           throw err;
        }
    }
    for(let i=0;i<allNumberArr.length;i++){
        let isTrue=await validation.isnumber(allNumberArr[i]);
        if(isTrue!==true){
           const err=new Error(isTrue);
           err.statusCode=422;
           throw err;
        }
    }
    //
            let getCompany=await DB.employee.findOne({
                where:{id:mangerId},
                attributes:['id'],
                include:{
                    model:DB.companyy,
                    attributes:['id']
                }
            });
            
            if(!getCompany.company){
                    const err=new Error('error');
                    err.statusCode=404;
                    throw err;
            }
            await getCompany.company.createBus({
                'type':type,
                'numOfSets':numOfSets,
                'driverName':driverName,
                'helpDriverName':helpDriverName,
                'numberOfBus':numberOfBus   
            });
            res.status(201).json({message:'added success'});
    }catch(err){
        if(!err.statusCode)
               err.statusCode=500;
        next(err);
    }
};
const updateBus=async(req,res,next)=>{
    const busId         =req.params.busId       ;
    const type          =req.body.type          ;
    const numOfSets     =req.body.numOfSets     ;
    const driverName    =req.body.driverName    ;
    const helpDriverName=req.body.helpDriverName;
    const numberOfBus   =req.body.numberOfBus   ;
    const mangerId      =req.mangerId           ;
    try{
    //validation
    let allStringArr=[type,driverName,helpDriverName];
    let allNumberArr=[busId,numOfSets,numberOfBus,mangerId];
    for(let i=0;i<allStringArr.length;i++){
        let isTrue=await validation.isSrting(allStringArr[i]);
        if(isTrue!==true){
           const err=new Error(isTrue);
           err.statusCode=422;
           throw err;
        }
    }
    for(let i=0;i<allNumberArr.length;i++){
        let isTrue=await validation.isnumber(allNumberArr[i]);
        if(isTrue!==true){
           const err=new Error(isTrue);
           err.statusCode=422;
           throw err;
        }
    }
    //
        let getBus=await DB.employee.findOne({
            where:{id:mangerId},
            attributes:['id'],
            include:{
                model:DB.companyy,
                attributes:['id'],
                include:{
                    model:DB.bus,
                    where:{id:busId}
                }
            }
        });
        if(!getBus.company){
            const err=new Error('this bus not found');
            err.statusCode=404;
            throw err;
        }
        await getBus.company.buses[0].update({
            'type':type,
            'numOfSets':numOfSets,
            'driverName':driverName,
            'helpDriverName':helpDriverName,
            'numberOfBus':numberOfBus   
        });
        res.status(200).json({message:'update success'});
    }catch(err){
        if(!err.statusCode)
             err.statusCode=500;
        next(err);
    }
};
const deleteBus=async(req,res,next)=>{
    const busId=req.params.busId;
    const mangerId=req.mangerId;
    try{
    //validation
    let allNumberArr=[busId,mangerId];
    for(let i=0;i<allNumberArr.length;i++){
        let isTrue=await validation.isnumber(allNumberArr[i]);
        if(isTrue!==true){
           const err=new Error(isTrue);
           err.statusCode=422;
           throw err;
        }
    }
    //
        let getBus=await DB.employee.findOne({
            where:{id:mangerId},
            attributes:['id'],
            include:{
                model:DB.companyy,
                attributes:['id'],
                include:{
                    model:DB.bus,
                    where:{id:busId},
                    include:{
                        model:DB.trip
                    }
                }
            }
        });
        if(!getBus.company){
            const err=new Error('this bus not found');
            err.statusCode=404;
            throw err;
        }
        if(getBus.company.buses[0].trips.length!=0){
            for(let i of getBus.company.buses[0].trips)
                      await i.destroy();
        }
        await getBus.company.buses[0].destroy();
        res.status(200).json({message:"delete success"});
    }catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};
const getBusesNumberAndCities=async(req,res,next)=>{
    const mangerId=req.mangerId;
    try{
        //validation
        let isTrue=await validation.isnumber(mangerId);
        if(isTrue!==true){
           const err=new Error(isTrue);
           err.statusCode=422;
           throw err;
        }
        //
        let buses=await DB.employee.findOne({
            where:{id:mangerId},
            attributes:['id'],
            include:{
                model:DB.companyy,
                attributes:['id'],
                include:[{
                    model:DB.bus,
                    attributes:['numberOfBus']
                },{
                    model:DB.cityy,
                    where:{isDeleted:false},
                    attributes:['id','name']
                }]
            }
        });
        if(buses.company.buses.length==0){
            const err=new Error("no buses found");
            err.statusCode=404;
            throw err;
        }
        if(!Array.isArray(buses.company.cities)){
            const err=new Error("no cities found");
            err.statusCode=404;
            throw err;
        }
        let cities=buses.company.cities.map(i=>({"name":i.name}));
        buses=buses.company.buses.map(i=>({"busNumber":i.numberOfBus}));
        res.status(200).json({buses:buses,cities:cities});
    }catch(err){
       if(!err.statusCode)
               err.statusCode=500;
       next(err);
    }
};
module.exports={
    getBusesNumberAndCities,
    getBuses,
    addBus,
    updateBus,
    deleteBus
};