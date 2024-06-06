const jwt=require('jsonwebtoken');
const Op = require('sequelize').Op;
const socketIo=require('../../webSocket');
const checkDate=require('../../middleware/checkDate');
const OTP=require('../../middleware/OTP');
const DB=require('../../util/modelRequire');
const validation=require('../../validation/methods');
const getCode=async(req,res,next)=>{
    const phoneNumber=req.body.phoneNumber;
    try{
        //validation 
        let isTrue=await validation.isPhoneNumber(phoneNumber);
        if(isTrue!==true){
            const err=new Error(isTrue);
            err.statusCode=422;
            throw err;
        }
        //
        OTP.getOTP({phoneNumber:phoneNumber},(err,results,otp)=>{
            return res.status(200).json({
                    message:"OTP create success",
                    data:results,
                    otp:otp
            });
        });
    } catch(err){
        if(!err.statusCode)
             err.statusCode=500;
        next(err);
    }
};
const checkPhoneCode=async(req,res,next)=>{
    const phoneNumber=req.body.phoneNumber;
    const otp=req.body.otp;
    const hash=req.body.hash;
    try{
        //validation
        let isTrue=await validation.isPhoneNumber(phoneNumber);
        if(isTrue!==true){
            const err=new Error(isTrue);
            err.statusCode=422;
            throw err;
        }
        isTrue=await validation.isnumber(otp);
        if(isTrue!==true){
            const err=new Error(isTrue);
            err.statusCode=422;
            throw err;
        }
        isTrue=await validation.isHash(hash);
        if(isTrue!==true){
            const err=new Error(isTrue);
            err.statusCode=422;
            throw err;
        }
        //
        //check for code
        OTP.verifyOTP({
            phoneNumber:phoneNumber,
            otp:otp,
            hash:hash
        },(err,results)=>{
            if(err){
                throw {message:err,statusCode:403};
            }
            return true;
        });
        //
        const checkPhone=await DB.userrAccount.findOne({
            where:{phoneNumber:phoneNumber},
            include:{
                model:DB.customer,
                where:{isOwner:true}
            },
        });
        if(checkPhone){
            let createcustomer={
                phoneNumber:phoneNumber,
                id :checkPhone.customers[0].id ,
                firstName :checkPhone.customers[0].firstName ,
                lastName  :checkPhone.customers[0].lastName  ,
                fatherName:checkPhone.customers[0].fatherName,
                motherName:checkPhone.customers[0].motherName,
                gender    :checkPhone.customers[0].gender    ,
                iss       :checkPhone.customers[0].iss       ,
            }
            let token=jwt.sign({customerId:createcustomer.id},'mobileApp',{expiresIn:'48h'});
            res.status(200).json({
                token:token,
                profile:createcustomer
            });
        }else{
            res.status(200).json({
                message:"welcome , please register in our application"
            });
        }
    }catch(err){
       if(!err.statusCode)
            err.statusCode=500;
        next(err);
   }
};
const register=async(req,res,next)=>{
    const phoneNumber=req.body.phoneNumber;
    const firstName  =req.body.firstName  ;
    const lastName   =req.body.lastName   ;
    const fatherName =req.body.fatherName ;
    const motherName =req.body.motherName ;
    const gender     =req.body.gender     ;
    const iss        =req.body.iss        ;
    try{
        //validation
        let isTrue=await validation.isPhoneNumber(phoneNumber);
        if(isTrue!==true){
            const err=new Error(isTrue);
            err.statusCode=422;
            throw err;
        }
        let allStringArr=[firstName,lastName,fatherName,motherName,gender];
        for(let i=0;i<allStringArr.length;i++){
            isTrue=await validation.isSrting(allStringArr[i]);
            if(isTrue!==true){
                const err=new Error(isTrue);
                err.statusCode=422;
                throw err;
            }
        }
        isTrue=await validation.isIss(iss);
        if(isTrue!==true){
            const err=new Error(isTrue);
            err.statusCode=422;
            throw err;
        }
        //
        const checkPhone=await DB.userrAccount.findOne({where:{phoneNumber:phoneNumber}});
        let createcustomer='';
        if(checkPhone){
             let isHaveOwner=await checkPhone.getCustomers({where:{isOwner:true}});
             if(isHaveOwner.length!=0){
                const err=new Error('this phone number exists before please login using another one');
                err.statusCode=422;
                throw err;
            }
            createcustomer=checkPhone;
            let oldCus=await createcustomer.getCustomers({where:{
                firstName  :firstName  ,
                lastName   :lastName   ,
                fatherName :fatherName ,
                motherName :motherName ,
                gender     :gender     ,
                iss        :iss        ,
            }});
            if(oldCus.length!=0){
                oldCus[0].isOwner=true;
                await oldCus[0].save();
                createcustomer=oldCus[0];
            }else{
                createcustomer=await createcustomer.createCustomer({
                    firstName  :firstName  ,
                    lastName   :lastName   ,
                    fatherName :fatherName ,
                    motherName :motherName ,
                    gender     :gender     ,
                    iss        :iss        ,
                    isOwner:true
                });
            }
        }else{
            createcustomer=await DB.userrAccount.create({phoneNumber:phoneNumber});
            createcustomer=await createcustomer.createCustomer({
                firstName  :firstName  ,
                lastName   :lastName   ,
                fatherName :fatherName ,
                motherName :motherName ,
                gender     :gender     ,
                iss        :iss        ,
                isOwner:true
            });
        }
        createcustomer={
            phoneNumber:phoneNumber,
            id :createcustomer.id ,
            firstName :createcustomer.firstName ,
            lastName  :createcustomer.lastName  ,
            fatherName:createcustomer.fatherName,
            motherName:createcustomer.motherName,
            gender    :createcustomer.gender    ,
            iss       :createcustomer.iss       ,
        }
        let token=jwt.sign({customerId:createcustomer.id},'mobileApp',{expiresIn:'48h'});
        res.status(201).json({
            token:token,
            profile:createcustomer
        });
    }catch(err){
        if(!err.statusCode)
           err.statusCode=500;
        next(err);
    }
};
const updateProfile=async(req,res,next)=>{
        const customerId =req.customerId;
        const phoneNumber=req.body.phoneNumber;
        const firstName  =req.body.firstName  ;
        const lastName   =req.body.lastName   ;
        const fatherName =req.body.fatherName ;
        const motherName =req.body.motherName ;
        const gender     =req.body.gender     ;
        const iss        =req.body.iss        ;
        try{
            //validation
            let isTrue=await validation.isnumber(customerId);
            if(isTrue!==true){
                const err=new Error(isTrue);
                err.statusCode=422;
                throw err;
            }
            isTrue=await validation.isPhoneNumber(phoneNumber);
            if(isTrue!==true){
                const err=new Error(isTrue);
                err.statusCode=422;
                throw err;
            }
            let allStringArr=[firstName,lastName,fatherName,motherName,gender];
            for(let i=0;i<allStringArr.length;i++){
                isTrue=await validation.isSrting(allStringArr[i]);
                if(isTrue!==true){
                    const err=new Error(isTrue);
                    err.statusCode=422;
                    throw err;
                }
            }
            isTrue=await validation.isIss(iss);
            if(isTrue!==true){
                const err=new Error(isTrue);
                err.statusCode=422;
                throw err;
            }
            //
            const checkPhone=await DB.userrAccount.findOne({
                where:{phoneNumber:phoneNumber},
                include:{
                    model:DB.customer,
                    where: {id:{[Op.ne]:customerId},isOwner:true}
                }
            });
            if(checkPhone){
                    const err=new Error('this phone number exists before please login using another one');
                    err.statusCode=422;
                    throw err;
            }
            let updatedCustomer=await DB.customer.findOne({
                    where:{id:customerId},
                    include:{
                        model:DB.userrAccount,
                        attributes:['id','phoneNumber']
                    }
            });
            if(!updatedCustomer){
                    const err=new Error('this customer not found');
                    err.statusCode=422;
                    throw err;
            }
            updatedCustomer.userAccounts[0].phoneNumber=phoneNumber;
            updatedCustomer.firstName = firstName ; 
            updatedCustomer.lastName  = lastName  ; 
            updatedCustomer.fatherName= fatherName; 
            updatedCustomer.motherName= motherName; 
            updatedCustomer.gender    = gender    ; 
            updatedCustomer.iss       = iss       ; 
            await updatedCustomer.save();
            await updatedCustomer.userAccounts[0].save();
           res.status(200).json({
            profile:{
                id:updatedCustomer.id,
                phoneNumber:phoneNumber,
                firstName:  firstName  ,
                lastName:   lastName   ,
                fatherName: fatherName ,
                motherName: motherName ,
                gender:     gender     ,
                iss:        iss        
            }
           });
        }catch(err){
           if(!err.statusCode)
                err.statusCode=500;
           next(err);
        }
};
const home=async(req,res,next)=>{
    const goFrom=req.params.goFrom;
    try{
         //validation
         let isTrue=await validation.isSrting(goFrom);
         if(isTrue!==true){
             const err=new Error(isTrue);
             err.statusCode=422;
             throw err;
         }
         //
         let offers=await DB.offer.findAll({attributes:['companyName','desc','img']});
         let tripsFromHere=await DB.trip.findAll({
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
                where:{name:goFrom}
            },{
                model:DB.cityy,as:'to',
                attributes:['name']
            }]
         });
         tripsFromHere.length!=0?
            tripsFromHere=tripsFromHere.map(i=>({
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
         })):tripsFromHere=[];
         res.status(200).json({
            allOffer:offers,
            tripsFromHere:tripsFromHere
         });
    }catch(err){
        if(!err.statusCode)
           err.statusCode=500;
        next(err);
    }
};
const searchForTrips=async(req,res,next)=>{
    const from=req.body.from;
    const to=  req.body.to;
    var dateFromCustomer=req.body.date;
    let date1=new Date(dateFromCustomer);
    let date=new Date(date1.getFullYear(),date1.getMonth(),date1.getDate(),0,0,0);
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
        if(to.length!=0){
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
        }else{ 
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
                }]
            });
        }
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
const removeBook=async(req,res,next)=>{
    const tripId=req.params.tripId;
    const customerId=req.customerId;
    try{
        //validation
        let allNumberArr=[tripId,customerId];
        let isTrue=true;
        for(let i=0;i<allNumberArr.length;i++){
            isTrue=await validation.isnumber(allNumberArr[i]);
            if(isTrue!==true){
                const err=new Error(isTrue);
                err.statusCode=422;
                throw err;
            }
        }
        //
        let tripToRemove=await DB.reservation.findOne({
            where:{ownerId:customerId,tripId:tripId},
            attributes:['chearNum']   
        });
        let trip=await DB.trip.findOne({
            where:{
                id:tripId,
                date:{
                   [Op.gt]:(new Date())
                }
            },
            attributes:['date','id']
        })
        if(!tripToRemove){
            const err=new Error('you are not booked in it');
            err.statusCode=422;
            throw err;
        }
        if(!trip){
            const err=new Error('this trip not found or is end');
            err.statusCode=422;
            throw err;
        }
        let checkLast12Houres=((new Date()).getTime())+12*60*60*1000;
        if(trip.date<=checkLast12Houres){
            //back 75% of his monye
        }else{
            //return 100% of his monye 
        }
        // all chear reopen with websocket
        //remove reservation
        let chearArray=tripToRemove.chearNum.split(',');

         let chear=await DB.chearr.findAll({where:{number:chearArray}});

        await trip.addChears(chear,{through:{isBooked:'no',bookingDate:null}});
        let customerToRemove=await trip.getCustomers({through:{
            model:DB.reservation,
            where:{chearNum:tripToRemove.chearNum}
        }});
        await trip.removeCustomers(customerToRemove);
        chearArray=chearArray.map(i=>({number:i,isBooked:"no"}));
        socketIo.getSocket().emit('chearsStatus',{chearOwnerId:customerId,tripId:tripId,chear:chearArray});
        res.status(200).json({message:"remove success"});
    }catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};
const myHistory=async(req,res,next)=>{
    const customerId=req.customerId;
    try{
        //validation
        let isTrue=await validation.isnumber(customerId);
        if(isTrue!==true){
            const err=new Error(isTrue);
            err.statusCode=422;
            throw err;
        }
        //
        let custmReservations=await DB.reservation.findAll({
            where:{ownerId:customerId},
            attributes:['tripId']            
        });
        let trips=await DB.trip.findAll({
                where:{
                    date: {
                        [Op.lt]: (new Date()).getTime()-(2*60*60*1000),
                    },
                    id:custmReservations.map(i=>i.tripId)
                },
                attributes:['id','date'],
                include:[
                    {
                        model:DB.cityy,as:'from',attributes:['name']
                    },{
                        model:DB.cityy,as:'to',attributes:['name']
                    },{
                        model:DB.bus,
                        attributes:['numberOfBus']
                    },{
                        model:DB.customer,
                        attributes:['firstName','lastName','iss'],
                        through:{
                            model:DB.reservation,
                            where:{ownerId:customerId},
                            attributes:['chearNum','numberOfSets','totalPrice']
                        }
                    }
                ],
        });
        if(trips.length==0){
            res.status(200).json({reservations:[]});
        }else{
            let reservations=trips.map(i=>({
                tripId:i.id,
                totalPrice:i.customers[0].reservation.totalPrice,
                date:i.date,
                from:i.from.name,
                to:i.to.name,
                numberOfBus:i.bus.numberOfBus,
                numberOfSets:i.customers[0].reservation.numberOfSets,
                chearNum:i.customers[0].reservation.chearNum,
                myPeople:i.customers.map(j=>({
                    firstName:j.firstName,lastName:j.lastName,iss:j.iss
                }))
            }));
            res.status(200).json({reservations:reservations});
        }
    }catch(err){
        if(!err.statusCode)
               err.statusCode=500;
        next(err);
    }
};
const rateTrip=async(req,res,next)=>{
    const customerId=req.customerId;
    const tripId    =req.body.tripId;
    const rate      =req.body.rate;
    const comment   =req.body.comment;
    try{
        //validation
        let allNumberArr=[customerId,tripId,rate];
        let isTrue=true;
        for(let i=0;i<allNumberArr.length;i++){
             isTrue=await validation.isnumber(allNumberArr[i]);
             if(isTrue!==true){
                const err=new Error(isTrue);
                err.statusCode=422;
                throw err;
             }
        }
        isTrue=await validation.isComment(comment);
        if(isTrue!==true){
            const err=new Error(isTrue);
            err.statusCode=422;
            throw err;
        }
        //
        let custm=await DB.reservation.findAll({where:{
            ownerId:customerId,
            tripId:tripId
        }})
        if(!custm){
            const err=new Error('this trip not found or you are not booked in this trip');
            err.statusCode=404;
            throw err;
        }
        for(let i=0;i<custm.length;i++){
             custm[i].rate=rate;
             custm[i].comment=comment;
             await custm[i].save();
        }
        res.status(201).json({custm,message:"thanks for your collaporations"});
    }catch(err){
        if(!err.statusCode)
               err.statusCode=500;
        next(err);
    }
};
const getChear=async(req,res,next)=>{
    const tripId=req.params.tripId;
    const customerId=req.customerId;
    try{
        //validation
        let isTrue=await validation.isnumber(tripId);
        if(isTrue!==true){
            const err=new Error(isTrue);
            err.statusCode=422;
            throw err;
        }
        isTrue=await validation.isnumber(customerId);
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
            }]
        });
        if(!chearsTrip){
            const err=new Error("this trip not found");
            err.statusCode=404;
            throw err;
        }
        let customerChear=[];
        if(chearsTrip.customers.length!=0)
            for(let i=0;i<chearsTrip.customers.length;i++){
                if(chearsTrip.customers[i].id==customerId){
                    (chearsTrip.customers[i].reservation.chearNum.
                        slice(',')).
                        map(j=>{customerChear.push(j);});
                    break;
                }
            }
        //chearTrip this variable to send it to client in res
        let chearTrip=chearsTrip.chears;
        
        let tripChears=chearsTrip.chears;
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
                myChear:customerChear,
                chear:chearTrip
            });
    }catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};
const cancelBookChear=async(req,res,next)=>{
  const tripId=req.body.tripId;
  const chear=req.body.chear;
  const customerId=req.customerId;
  try{
    // validation
    let allNumberArr=[tripId,...chear,customerId];
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
    socketIo.getSocket().emit('chearsStatus',{chearOwnerId:customerId,tripId:tripId,chear:chearToCancel});
    res.status(200).json({message:'cancel success'});
}catch(err){
    if(!err.statusCode)
        err.statusCode=500;
    next(err);
}
};
const bookChear=async(req,res,next)=>{
    const tripId=req.body.tripId;
    let chear=req.body.chear; 
    const customerId=req.customerId;
    try{
        // validation
        let allNumberArr=[tripId,...chear,customerId];
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
        socketIo.getSocket().emit('chearsStatus',{chearOwnerId:customerId,tripId:tripId,chear:chear});
        res.status(200).json({message:"chears are in booking status"}); 
    }catch(err){
        if(!err.statusCode)
              err.statusCode=500;
        next(err);
    }
};
const submitBooking=async(req,res,next)=>{
    const customerId    =req.customerId        ;
    const paymentId     =req.body.paymentId    ;
    const terminalId    =req.body.terminalId   ;
    const paymentType   =req.body.paymentType  ;
    const tripId        =req.body.tripId       ;
    const numberOfSets  =req.body.numberOfSets ;
    const totalPrice    =req.body.totalPrice   ;
    const chear         =req.body.chear        ;
    const phoneNumber   =req.body.phoneNumber  ;
    const customers     =req.body.customers    ;
    try{
        // validation
        let custmersInfo=[];
        let iss=[];
        let allNumberArr=[customerId,terminalId,tripId,numberOfSets,totalPrice,...chear];
        for(let i=0;i<customers.length;i++){
            iss.push(customers[i].iss);
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
            bookedFrom:"mopile" ,
            chearNum:ch,
            paymentId:paymentId,
            terminalId:terminalId,
            paymentType:paymentType,
            ownerId:customerId
        }});
        await tripp.addChears(chear,{through:{isBooked:"yes",bookingDate:((new Date()).getTime())+(3*60*60*1000)}});
        let chearToObject=chear.map(i=>({number:i,isBooked:"yes"}));
        socketIo.getSocket().emit('chearsStatus',{chearOwnerId:customerId,tripId:tripId,chear:chearToObject});
        res.status(201).json({message:"booking submited success"});
    }catch(err){
        if(!err.statusCode)
           err.statusCode=500;
        next(err);
    }
};
const getNews=async(req,res,next)=>{
   try{
       let news=await DB.newss.findAll({attributes:['img','desc']});
       res.status(200).json({news:news});
   }catch(err){
       if(!err.statusCode)
           err.statusCode=500;
        next(err);
   }
};
const reservation=async(req,res,next)=>{
    const customerId=req.customerId;
    try{
        //validation
        let isTrue=await validation.isnumber(customerId);
        if(isTrue!==true){
            const err=new Error(isTrue);
            err.statusCode=422;
            throw err;
        }
        //
        let custmReservations=await DB.reservation.findAll({
            where:{ownerId:customerId},
            attributes:['tripId']            
        });
        let trips=await DB.trip.findAll({
                where:{
                    date: {
                        [Op.gte]: (new Date()).getTime()-(2*60*60*1000)
                    },
                    id:custmReservations.map(i=>i.tripId)
                },
                attributes:['id','date'],
                include:[
                    {
                        model:DB.cityy,as:'from',attributes:['name']
                    },{
                        model:DB.cityy,as:'to',attributes:['name']
                    },{
                        model:DB.bus,
                        attributes:['numberOfBus']
                    },{
                        model:DB.customer,
                        attributes:['firstName','lastName','iss'],
                        through:{
                            model:DB.reservation,
                            where:{ownerId:customerId},
                            attributes:['chearNum','numberOfSets','totalPrice']
                        }
                    }
                ],
        });
        if(trips.length==0){
            res.status(200).json({reservations:[]});
        }else{
            let reservations=trips.map(i=>({
                tripId:i.id,
                totalPrice:i.customers[0].reservation.totalPrice,
                date:i.date,
                from:i.from.name,
                to:i.to.name,
                numberOfBus:i.bus.numberOfBus,
                numberOfSets:i.customers[0].reservation.numberOfSets,
                chearNum:i.customers[0].reservation.chearNum,
                myPeople:i.customers.map(j=>({
                    firstName:j.firstName,lastName:j.lastName,iss:j.iss
                }))
            }));
            res.status(200).json({reservations:reservations});
        }
    }catch(err){
        if(!err.statusCode)
               err.statusCode=500;
        next(err);
    }
};

module.exports={
    reservation,
    checkPhoneCode,
    register,
    updateProfile,
    home,
    searchForTrips,
    removeBook,
    myHistory,
    rateTrip,
    getChear,
    cancelBookChear,
    bookChear,
    submitBooking,
    getCode,
    getNews
};