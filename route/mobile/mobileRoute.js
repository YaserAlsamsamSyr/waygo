const express=require('express');
const route=express.Router();
const auth=require('../../middleware/auth').mobile;
const customerController=require('../../controller/mobile/mobileController');

route.post('/checkPhoneCode',customerController.checkPhoneCode);
route.post('/getCode',customerController.getCode);
route.post('/register',customerController.register);
route.post('/searchForTrips',customerController.searchForTrips);
route.post('/rateTrip',auth,customerController.rateTrip);
route.post('/cancelBookChear',auth,customerController.cancelBookChear);
route.post('/bookChear',auth,customerController.bookChear);
route.post('/submitBooking',auth,customerController.submitBooking);

route.put('/updateProfile',auth,customerController.updateProfile);

route.get('/home/:goFrom',customerController.home);
route.get('/myHistory',auth,customerController.myHistory);
route.get('/reservation',auth,customerController.reservation);
route.get('/getChear/:tripId',auth,customerController.getChear);
route.get('/getNews',customerController.getNews);

route.delete('/removeBook/:tripId',auth,customerController.removeBook);

module.exports=route;