const tripController=require('./trip/tripController');
const jwt=require('jsonwebtoken');
const busController=require('./bus/busController');
const validation=require('../../validation/methods');
//////login///////
const login=async(req,res,next)=>{
    const employee=require('../../models/employee');
    const userName=req.body.userName;
    const password=req.body.password;
    try{
        // validation
        let isUserNameValid=await validation.isUserName(userName);
        if(isUserNameValid!==true){
            const err=new Error(isUserNameValid);
            err.statusCode=422;
            throw err;
        }
        let isPasswordValid=await validation.isPassword(password);
        if(isPasswordValid!==true){
            const err=new Error(isPasswordValid);
            err.statusCode=422;
            throw err;
        }
        /////
        const admin=await employee.findOne({where:{email:userName,password:password}});
        if(!admin){
           const err=new Error('password or email incorrect');
           err.statusCode=422;
           throw err;
        }
        const company=await admin.getCompany();
        let token=jwt.sign({mangerId:admin.id},'companyApp',{expiresIn:'10h'});
    res.status(200).json({
            token:token,
            companyName:company.name,
            companyImage:company.image
    });
    }catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};
///////Trip///////
const getOldTrips=tripController.getOldTrips;
const getChear=tripController.getChear;
const bookChear=tripController.bookChear;
const submitBooking=tripController.submitBooking;
const deleteOldTrip=tripController.deleteOldTrip;
const deleteAvailabelTrip=tripController.deleteAvailabelTrip;
const getValidTrips=tripController.getValidTrips;
const addTrip=tripController.addTrip;
const getCustomersInTrip=tripController.getCustomersInTrip;
const cancelBookChear=tripController.cancelBookChear;
///////Bus///////
const getBuses=busController.getBuses;
const addBus=busController.addBus;
const updateBus=busController.updateBus;
const deleteBus=busController.deleteBus;
const getBusesNumberAndCities=busController.getBusesNumberAndCities;

module.exports={
    login,
    getBuses,
    addBus,
    updateBus,
    deleteBus,
    getOldTrips,
    getChear,
    cancelBookChear,
    bookChear,
    submitBooking,
    deleteOldTrip,
    deleteAvailabelTrip,
    getValidTrips,
    addTrip,
    getCustomersInTrip,
    getBusesNumberAndCities
};