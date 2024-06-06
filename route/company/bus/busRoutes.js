const express=require('express');
const companyController=require('../../../controller/company/companyController');
const auth=require('../../../middleware/auth');
const route=express.Router();

route.get('/getBuses',auth.company,companyController.getBuses);
route.get('/getBusesNumberAndCities',auth.company,companyController.getBusesNumberAndCities);
route.post('/addBus',auth.company,companyController.addBus);
route.put('/updateBus/:busId',auth.company,companyController.updateBus);
route.delete('/deleteBus/:busId',auth.company,companyController.deleteBus);

module.exports=route;