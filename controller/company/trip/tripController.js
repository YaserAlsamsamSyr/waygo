const socketIo=require('../../../webSocket');
const checkDate=require('../../../middleware/checkDate');
const sequelize = require('sequelize');
const DB=require('../../../util/modelRequire');
const Op = require('sequelize').Op;
const validation=require('../../../validation/methods');
const getOldTrips=async(req,res,next)=>{
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
        let dateString=(new Date()).getTime()+(1000*60*60*3);
        let date=new Date(dateString);
        let trips=await DB.employee.findOne({
            where:{id:mangerId},attributes:['email'],
            include:[
                {
                    model:DB.companyy,
                    attributes:['name'],
                    include:[
                        {
                            model:DB.trip,
                            attributes:['id','date','ticktPrice'],
                            where: {
                                date: {
                                  [Op.lt]: date,
                                },
                              },
                            include:[
                                {
                                    model:DB.cityy,as:'from',attributes:['name']
                                },{
                                    model:DB.cityy,as:'to',attributes:['name']
                                },
                                {
                                    model:DB.bus,
                                    attributes:[
                                        'type',
                                        'numOfSets',
                                        'driverName',
                                        'helpDriverName',
                                        'numberOfBus'
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });
        //thread
        let oldTrips=[];
        oldTrips=trips.company.trips;
        if(oldTrips.length==0){
            const err=new Error('no trips found');
            err.statusCode=404;
            throw err;
        }
        oldTrips=oldTrips.map(i=>{
            return{
                "buse":i.bus,
                "id":i.id,
                "from":i.from.name,
                "to":i.to.name,
                "ticktPrice":i.ticktPrice,
                "date":i.date,
            };
        });
        res.status(200).json({trips:oldTrips});
    }catch(err){
        if(!err.statusCode)
                err.statusCode=500;
        next(err);
    }
};
const getValidTrips=async(req,res,next)=>{
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
        let dateString=(new Date()).getTime()+(1000*60*60*3);
        let date=new Date(dateString);
        let trips=await DB.employee.findOne({
            where:{id:mangerId},attributes:['email'],
            include:[
                {
                    model:DB.companyy,
                    attributes:['name'],
                    include:[
                        {
                            model:DB.trip,
                            attributes:['id','date','ticktPrice'],
                            where: {
                                date: {
                                  [Op.gte]: date,
                                },
                              },
                            include:[
                                {
                                    model:DB.cityy,as:'from',attributes:['name']
                                },{
                                    model:DB.cityy,as:'to',attributes:['name']
                                },
                                {
                                    model:DB.bus,
                                    attributes:[
                                        'type',
                                        'numOfSets',
                                        'driverName',
                                        'helpDriverName',
                                        'numberOfBus'
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });
        //thread
        let validTrips=[];
        validTrips=trips.company.trips;
        if(validTrips.length==0){
            const err=new Error('no trips found');
            err.statusCode=404;
            throw err;
        }
        validTrips=validTrips.map(i=>{
            return{
                "buse":i.bus,
                "id":i.id,
                "from":i.from.name,
                "to":i.to.name,
                "ticktPrice":i.ticktPrice,
                "date":i.date,
            };
        });
        res.status(200).json({trips:validTrips});
    }catch(err){
        if(!err.statusCode)
                err.statusCode=500;
        next(err);
    }
};
const getChear=async(req,res,next)=>{
    const tripId=req.params.tripId;
    try{
        //validation
        let isTrue=await validation.isnumber(tripId);
        if(isTrue!==true){
           const err=new Error(isTrue);
           err.statusCode=422;
           throw err;
        }
        //
        let chearsTrip=await DB.trip.findOne({where:{id:tripId},attributes:['id'],
            include:[
                {
                    model:DB.chearr,
                    attributes:['number','id'],
                    through:{
                        attributes:['isBooked','bookingDate']
                    }
                },{
                    model:DB.customer,
                    attributes:['id'],
                    through:{
                        attributes:['chearNum']
                    }  
                }
            ]
        });
        let tripChears=chearsTrip.chears;
        //chearTrip this variable to send it to client in res
        let chearTrip=chearsTrip.chears;
        // reopen isBooking sets [thread]
        let reopenChear=[];
        for(let i=0;i<tripChears.length;i++){
            if(
                tripChears[i].bookedChear.isBooked=='isBooking' && 
                !checkDate(tripChears[i].bookedChear.bookingDate)
            ){
                
                chearTrip[i].bookedChear.isBooked='no';
                chearTrip[i].bookedChear.bookingDate='';
                reopenChear.push(tripChears[i]);
            }
        }
        reopenChear.length==0 ?'':
        await chearsTrip.addChears(reopenChear,{through:{ isBooked:"no",bookingDate:''}});
        reopenChear=reopenChear.map(i=>{
            return {number:i.number,isBooked:'no'};
        });
        // web socket send chear:[number,isBooked:]
        socketIo.getSocket().emit('chearsStatus',{chearOwnerId:'',tripId:tripId,chear:reopenChear});
        //
        chearTrip=chearTrip.map(i=>{
            return{
                number:i.number,isBooked:i.bookedChear.isBooked 
            };
        });
            res.status(200).json({
                chear:chearTrip
            });
    }catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};
const bookChear=async(req,res,next)=>{
    const tripId=req.body.tripId;
    let chear=req.body.chear;
    const mangerId=req.mangerId;
    try{
        // validation
        let allNumberArr=[tripId,mangerId,...chear];
        for(let i=0;i<allNumberArr.length;i++){
            let isTrue=await validation.isnumber(allNumberArr[i]);
            if(isTrue!==true){
               const err=new Error(isTrue);
               err.statusCode=422;
               throw err;
            }
        }
        //
        const tripp=await DB.trip.findOne({where:{id:tripId},
                attributes:['id'],
                include:{
                model:DB.chearr,
                attributes:['number','id'],
                where: { 'number':chear },
                through:{
                    model:DB.bookedChear,
                    attributes:['isBooked','bookingDate']
                }
             }
            });
        if(!tripp){
            const err=new Error('this trip not found');
            err.statusCode=404;
            throw err;
        }
        let chears=tripp.chears;
        //check if chears not already booked
        let isWrong=false;
        for(i=0;i<chears.length;i++){
            isWrong=chears[i].bookedChear.isBooked=="yes"?true:chears[i].bookedChear.isBooked=="isBooking"?true:false;
            if(isWrong){
                const err=new Error(`chear number ${chears[i].number} is already booked`);
                err.statusCode=401;
                throw err;
            }
        }
        let after15Minutes=((new Date()).getTime())+(15*60*1000)+(3*60*60*1000);
        await tripp.addChears(chears,{through:{ isBooked:"isBooking",bookingDate:after15Minutes}});
        // web socket send chear:[number,isBooked:]
        chear=chear.map(i=>({number:i,isBooked:"isBooking"}));
        socketIo.getSocket().emit('chearsStatus',{chearOwnerId:mangerId,tripId:tripId,chear:chear});
        res.status(200).json({message:"chears are in booking status"}); 
    }catch(err){
        if(!err.statusCode)
              err.statusCode=500;
        next(err);
    }
};
const cancelBookChear=async(req,res,next)=>{
  const tripId=req.body.tripId;
  const chear=req.body.chear;
  const mangerId=req.mangerId;
  try{
    // validation
    let allNumberArr=[tripId,mangerId,...chear];
    for(let i=0;i<allNumberArr.length;i++){
        let isTrue=await validation.isnumber(allNumberArr[i]);
        if(isTrue!==true){
           const err=new Error(isTrue);
           err.statusCode=422;
           throw err;
        }
    }
    //
    let tripChear=await DB.trip.findOne({
            where:{id:tripId},
            attributes:['id'],
            include:[
                {
                    model:DB.chearr,
                    attributes:['number','id'],
                    where:{number:chear},
                    through:{
                        model:DB.bookedChear,
                        attributes:[],
                        where:{isBooked:'isBooking'}
                    }
                }
            ]
    });
    if(!tripChear){
        const err=new Error("this chears can't be cancel booking of them");
        err.statusCode=422;
        throw err;
    }
    await tripChear.addChears(tripChear.chears,{through:{isBooked:'no',bookingDate:''}});
    // web socket send chear:[number,isBooked:]
    let chearToCancel=tripChear.chears;
    chearToCancel=chearToCancel.map(i=>({number:i.number,isBooked:"no"}));
    socketIo.getSocket().emit('chearsStatus',{chearOwnerId:mangerId,tripId:tripId,chear:chearToCancel});
    res.status(200).json({message:'cancel success'});
}catch(err){
    if(!err.statusCode)
        err.statusCode=500;
    next(err);
}
};
const submitBooking=async(req,res,next)=>{
    const paymentId     =req.body.paymentId    ;
    const terminalId    =req.body.terminalId   ;
    const paymentType   =req.body.paymentType  ;
    const tripId        =req.body.tripId       ;
    const numberOfSets  =req.body.numberOfSets ;
    const totalPrice    =req.body.totalPrice   ;
    const chear         =req.body.chear        ;
    const phoneNumber   =req.body.phoneNumber  ;
    const customers     =req.body.customers    ;
    const mangerId      =req.mangerId;
    try{
        // validation
        let custmersInfo=[];
        let iss=[];
        let allNumberArr=[terminalId,tripId,numberOfSets,totalPrice,...chear,mangerId];
        for(let i=0;i<customers.length;i++){
            iss.push(customers[i].iss)
            custmersInfo.push(customers[i].firstName);
            custmersInfo.push(customers[i].lastName);
            custmersInfo.push(customers[i].fatherName);
            custmersInfo.push(customers[i].motherName);
            custmersInfo.push(customers[i].gender);
        }
        let isTrue=await validation.isPaymentId(paymentId);
        if(isTrue!==true){
            const err=new Error(isTrue);
            err.statusCode=422;
            throw err;
        }
        isTrue=await validation.isSrting(paymentType);
        if(isTrue!==true){
            const err=new Error(isTrue);
            err.statusCode=422;
            throw err;
        }
        for(let i=0;i<allNumberArr.length;i++){
            isTrue=await validation.isnumber(allNumberArr[i]);
            if(isTrue!==true){
               const err=new Error(isTrue);
               err.statusCode=422;
               throw err;
            }
        }
        isTrue=await validation.isPhoneNumber(phoneNumber);
        if(isTrue!==true){
            const err=new Error(isTrue);
            err.statusCode=422;
            throw err;
        }
        let j=0;
        for(let i=0;i<custmersInfo.length;i++){
            isTrue=await validation.isSrting(custmersInfo[i]);
            if(isTrue!==true){
               const err=new Error(isTrue);
               err.statusCode=422;
               throw err;
            }
            if((i+1)%5==0){
                isTrue=await validation.isIss(iss[j]);
                if(isTrue!==true){
                   const err=new Error(isTrue);
                   err.statusCode=422;
                   throw err;
                }   
                j++;
            }
        }
        // 
        // check from payment Id
        //https://egate-t.fatora.me/api/get-payment-status/:paymentId
        //response 
        /*
        {
            "ErrorMessage": "ResponseDescription",
            "ErrorCode": #,
            "Data": {
                "status": "X",
                "creationTimestamp": "",
                "rrn": "nnnnnnnnnnnn",
                "amount": #######,
                "terminalId": "XXXXXXXX", we take this and compare it with :terminalId that come from client
                "notes": "additional_notes",
            }
        }
        if(terminalId!=terminalId){
            const err=new Error('payment id not correct please chack it');
            err.statusCode(422);
            throw(err);
        }
        */
        let tripp=await DB.trip.findOne({
            where:{id:tripId},
            attributes:['id'],
            include:{
                model:DB.chearr,
                attributes:['number','id'],
                where:{number:chear},
                through:{
                     model:DB.bookedChear,
                     attributes:['isBooked','bookingDate']
                }
            }
        });
        if(!tripp){
            const err=new Error("this trip not found");
            err.statusCode=404;
            throw err;
        }
        //check date of chears
        let reopenChear=[];
        for(let i=0;i<tripp.chears.length;i++){
            if(tripp.chears[i].bookedChear.isBooked!='isBooking'){
                const err=new Error('one of chears is not ready to submit booking');
                err.statusCode=401;
                throw err;
            }
            if(
                tripp.chears[i].bookedChear.isBooked=='isBooking' && 
                !checkDate(tripp.chears[i].bookedChear.bookingDate)
            ){
                
                tripp.chears[i].bookedChear.isBooked='no';
                tripp.chears[i].bookedChear.bookingDate='';
                reopenChear.push(tripp.chears[i]);
            }
        }
        if(reopenChear.length!=0){
        await tripp.addChears(reopenChear,{through:{ isBooked:"no",bookingDate:''}});
        reopenChear=reopenChear.map(i=>{
            return {number:i.number,isBooked:'no'};
        });
        socketIo.getSocket().emit('chearsStatus',{chearOwnerId:'',tripId:tripId,chear:reopenChear});
        const err=new Error('time of bookin chears is end please rebook chears');
        err.statusCode=401;
        throw err;
        }
        //
        let userAccount=await DB.userrAccount.findOne({
            where:{phoneNumber:phoneNumber},attributes:['id']});
        if(!userAccount)
            userAccount=await DB.userrAccount.create({phoneNumber:phoneNumber});
        let allCustomers=await DB.customer.findAll();
        
        let newCustomer=[];
        let oldCustomer=[];
        let help=false;
        for(let i=0;i<customers.length;i++){
            for(let j=0;j<allCustomers.length;j++){
                if(
                    allCustomers[j].firstName  == customers[i].firstName &&
                    allCustomers[j].lastName   == customers[i].lastName  &&
                    allCustomers[j].fatherName == customers[i].fatherName&&
                    allCustomers[j].motherName == customers[i].motherName&&
                    allCustomers[j].gender     == customers[i].gender    
                ){
                    help=true;
                    oldCustomer.push(allCustomers[j]);
                    break;
                }
            }
            //checkcustomers without iss so we put customers array
            help==false?newCustomer.push(customers[i]):'';
            help=false;
        }
        newCustomer.length==0?'':newCustomer=await DB.customer.bulkCreate(newCustomer);
        let newWithOldCustomer=newCustomer.concat(oldCustomer);
        await userAccount.addCustomers(newWithOldCustomer);
        let ch=(chear.toString());
        let reserv=await tripp.addCustomers(newWithOldCustomer,{through:{
            totalPrice:totalPrice,
            numberOfSets:numberOfSets,
            bookedFrom:"company" ,
            chearNum:ch,
            paymentId:paymentId,
            terminalId:terminalId,
            paymentType:paymentType,
            ownerId:newWithOldCustomer[0].id
        }});
        await tripp.addChears(chear,{through:{isBooked:"yes",bookingDate:((new Date()).getTime())+(3*60*60*1000)}});
        let chearToObject=chear.map(i=>({number:i,isBooked:"yes"}));
        socketIo.getSocket().emit('chearsStatus',{chearOwnerId:mangerId,tripId:tripId,chear:chearToObject});
        res.status(201).json({message:"booking submited success"});
    }catch(err){
        console.log(err);
        if(!err.statusCode)
           err.statusCode=500;
        next(err);
    }
};
const deleteOldTrip=async(req,res,next)=>{
    const tripId=req.params.tripId;
    const mangerId=req.mangerId;
    try{
          //validation
          let allNumberArr=[tripId,mangerId];
          for(let i=0;i<allNumberArr.length;i++){
              isTrue=await validation.isnumber(allNumberArr[i]);
              if(isTrue!==true){
                 const err=new Error(isTrue);
                 err.statusCode=422;
                 throw err;
              }
          }
          //
          const Op = sequelize.Op
          let oldTrips=await DB.employee.findOne({
                        where:{id:mangerId},
                        attributes:['id'],
                        include:{
                            model:DB.companyy,
                            attributes:['id'],
                            include:{
                                model:DB.trip,
                                attributes:['id','ticktPrice','date',],
                                where:{date:{
                                    [Op.lt]:(new Date())
                                }},
                                include:[
                                    {
                                        model:DB.cityy,as:'from',attributes:['name']
                                    },{
                                        model:DB.cityy,as:'to',attributes:['name']
                                    },
                                    {
                                        model:DB.bus,
                                        attributes:[
                                            'type',
                                            'numOfSets',
                                            'driverName',
                                            'helpDriverName',
                                            'numberOfBus'
                                        ]
                                    }
                                ]
                            }
                        }
        });
        if(!oldTrips.company){
            const err=new Error("no trips available");
            err.statusCode=404;
            throw err;
        }
        let oTrips=oldTrips.company.trips;
        oTrips=oTrips.map(i=>({
                buse:i.bus,
                id:i.id,
                from:i.from.name,
                to:i.to.name,
                ticktPrice:i.ticktPrice,
                date:i.date,
        }));
        let indexToRemove=-1;
        for(let i=0;i<oTrips.length;i++)
            if(oTrips[i].id==tripId){
                indexToRemove=i;
                break;
            }
        if(indexToRemove==-1){
            const err=new Error('this trip not found');
            err.statusCode=404;
            throw err;
        }
        let tripToDelete=oTrips[indexToRemove];
        oTrips.splice(indexToRemove, 1);
        await DB.trip.destroy({where:{id:tripToDelete.id}});
        res.status(200).json({
            message:"delete success",
            trips:oTrips
        })
    }catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};
const deleteAvailabelTrip=async(req,res,next)=>{
    const tripId=req.params.tripId;
    const mangerId=req.mangerId;
    try{
          //validation
          let allNumberArr=[tripId,mangerId];
          for(let i=0;i<allNumberArr.length;i++){
              isTrue=await validation.isnumber(allNumberArr[i]);
              if(isTrue!==true){
                 const err=new Error(isTrue);
                 err.statusCode=422;
                 throw err;
              }
          }
          //
          const Op = sequelize.Op
          let availabelTrips=await DB.employee.findOne({
                        where:{id:mangerId},
                        attributes:['id'],
                        include:{
                            model:DB.companyy,
                            attributes:['id'],
                            include:{
                                model:DB.trip,
                                attributes:['id','ticktPrice','date',],
                                where:{date:{
                                    [Op.gt]:(new Date())
                                }},
                                include:[
                                    {
                                        model:DB.cityy,as:'from',attributes:['name']
                                    },{
                                        model:DB.cityy,as:'to',attributes:['name']
                                    },
                                    {
                                        model:DB.bus,
                                        attributes:[
                                            'type',
                                            'numOfSets',
                                            'driverName',
                                            'helpDriverName',
                                            'numberOfBus'
                                        ]
                                    }
                                ]
                            }
                        }
        });
        if(!availabelTrips.company){
            const err=new Error("no trips available");
            err.statusCode=404;
            throw err;
        }
        let aTrips=availabelTrips.company.trips;
        aTrips=aTrips.map(i=>({
                buse:i.bus,
                id:i.id,
                from:i.from.name,
                to:i.to.name,
                ticktPrice:i.ticktPrice,
                date:i.date,
        }));
        let indexToRemove=-1;
        for(let i=0;i<aTrips.length;i++)
            if(aTrips[i].id==tripId){
                indexToRemove=i;
                break;
            }
        if(indexToRemove==-1){
            const err=new Error('this trip not found');
            err.statusCode=404;
            throw err;
        }
        let tripToDelete=aTrips[indexToRemove];
        aTrips.splice(indexToRemove, 1);
        await DB.trip.destroy({where:{id:tripToDelete.id}});
        socketIo.getSocket().emit('availabelTrips',{availabelTrips:aTrips});
        res.status(200).json({
            message:"delete success",
            trips:aTrips
        })
    }catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};
const addTrip=async(req,res,next)=>{
    const from       =req.body.from      ;
    const to         =req.body.to        ;
    const date       =req.body.date      ;
    const busNumber  =req.body.busNumber ;
    const ticktPrice =req.body.ticktPrice;
    const mangerId=req.mangerId;
    try{
        //validation
        let allNumberArr=[busNumber,ticktPrice,mangerId];
        let allStringArr=[from,to];
        for(let i=0;i<allStringArr.length;i++){
            isTrue=await validation.isSrting(allStringArr[i]);
            if(isTrue!==true){
               const err=new Error(isTrue);
               err.statusCode=422;
               throw err;
            }
        }
        isTrue=await validation.isDate(date);
        if(isTrue!==true){
           const err=new Error(isTrue);
           err.statusCode=422;
           throw err;
        }
        for(let i=0;i<allNumberArr.length;i++){
              isTrue=await validation.isnumber(allNumberArr[i]);
              if(isTrue!==true){
                 const err=new Error(isTrue);
                 err.statusCode=422;
                 throw err;
              }
        }
        from[0]=from[0].toUpperCase();
        to[0]=to[0].toUpperCase();
        //
        let dateTrip=new Date(date);
        dateTrip=dateTrip.getTime()+(1000*60*60*3);
        const busForTrip=await DB.employee.findOne({
            where:{id:mangerId},
            attributes:['id'],
            include:{
                model:DB.companyy,
                attributes:['id'],
                include:[{
                   model:DB.bus,
                   where:{numberOfBus:busNumber},
                   attributes:[
                    'id',
                    'type',
                    'numOfSets',
                    'driverName',
                    'helpDriverName',
                    'numberOfBus'
                ]
                },{
                    model:DB.cityy,
                    where:{name:[from,to]},
                    attributes:['id','name']
                }]
            }
        });
        const city=busForTrip.company.cities;
        if(!busForTrip.company){
                const err=new Error('this bus not found');
                err.statusCode=404;
                throw err;
        }
        if(city.length!=2){
                const err=new Error('city from or to not found');
                err.statusCode=404;
                throw err;
        }
        city[0].name==from?'':(()=>{
            let f=city[1];
            city[1]=city[0];
            city[0]=f;
        })();
        let trip={
               ticktPrice:ticktPrice,
               date      :dateTrip,
               cityId    :city[0].id,
               companyId :busForTrip.company.id,
               fromCityId:city[0].id,
               toCityId  :city[1].id
        };
        let tripId=await busForTrip.company.buses[0].createTrip(trip);
        let tripChears=[];
        for(let i=0;i<busForTrip.company.buses[0].numOfSets;)
                  tripChears.push(++i);
        await tripId.addChears(tripChears);
        trip={
                buse:{        
                    type:busForTrip.company.buses[0].type,
                    numOfSets:busForTrip.company.buses[0].numOfSets,
                    driverName:busForTrip.company.buses[0].driverName,
                    helpDriverName:busForTrip.company.buses[0].helpDriverName,
                    numberOfBus:busForTrip.company.buses[0].numberOfBus   
                },
                id:tripId.id,
                from:from,
                to:to,
                ticktPrice:ticktPrice,
                date:date,
        };
        socketIo.getSocket().emit('availabelTrips',{availabelTrips:trip});
        res.status(201).json({message:"trip added success"});
    }catch(err){
        if(!err.statusCode)
               err.statusCode=500;
        next(err);
    }
};
const getCustomersInTrip=async(req,res,next)=>{
    const tripId=req.params.tripId;
    const mangerId=req.mangerId;
    try{
        //validation
        let allNumberArr=[tripId,mangerId];
        for(let i=0;i<allNumberArr.length;i++){
            isTrue=await validation.isnumber(allNumberArr[i]);
            if(isTrue!==true){
               const err=new Error(isTrue);
               err.statusCode=422;
               throw err;
            }
        }
        //
        const customers=await DB.employee.findOne({
            where:{id:mangerId},
            attributes:['id'],
            include:{
                model:DB.companyy,
                attributes:['id'],
                include:{
                    model:DB.trip,
                    where:{id:tripId},
                    attributes:['id'],
                    include:{
                        model:DB.customer,
                        attributes:[
                            'firstName',
                            'lastName',
                            'fatherName',
                            'motherName',
                            'gender',
                            'iss'
                        ],
                        include:{
                            model:DB.userrAccount,
                            attributes:['phoneNumber']
                        }
                    }
                }
            }
        });
        if(!customers.company){
            const err=new Error('this trip no found');
            err.statusCode=404;
            throw err;
        }
        if(customers.company.trips[0].customers.length==0){
            const err=new Error('this trip no customers found in it');
            err.statusCode=404;
            throw err;
        }
        let customersToSend=customers.company.trips[0].customers;
        customersToSend=customersToSend.map(i=>({
                firstName:   i.firstName,
                lastName:    i.lastName,
                fatherName:  i.fatherName,
                motherName:  i.motherName,
                gender:      i.gender,
                iss:         i.iss,
                phoneNumber: i.userAccounts[0].phoneNumber
        }));
        res.status(200).json({customers:customersToSend});
    }catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};
module.exports={
    getOldTrips,
    getChear,
    bookChear,
    cancelBookChear,
    submitBooking,
    deleteOldTrip,
    deleteAvailabelTrip,
    getValidTrips,
    addTrip,
    getCustomersInTrip,
};