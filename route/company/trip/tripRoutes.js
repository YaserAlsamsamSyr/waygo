const express=require('express');
const auth=require('../../../middleware/auth');
const companyController=require('../../../controller/company/companyController');
const route=express.Router();

route.get('/getOldTrips',auth.company,companyController.getOldTrips);
route.get('/getValidTrips',auth.company,companyController.getValidTrips);
route.get('/getChear/:tripId',auth.company,companyController.getChear);
route.get('/getCustomersInTrip/:tripId',auth.company,companyController.getCustomersInTrip);

route.delete('/deleteOldTrip/:tripId',auth.company,companyController.deleteOldTrip);
route.delete('/deleteAvailabelTrip/:tripId',auth.company,companyController.deleteAvailabelTrip);

route.post('/cancelBookChear',auth.company,companyController.cancelBookChear);
route.post('/addTrip',auth.company,companyController.addTrip);
route.post('/submitBooking',auth.company,companyController.submitBooking);
route.post('/bookChear',auth.company,companyController.bookChear);

module.exports=route;