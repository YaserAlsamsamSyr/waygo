const express=require('express');
const companyController=require('../../controller/company/companyController');
const busRoutes=require('./bus/busRoutes');
const tripRoutes=require('./trip/tripRoutes');
const route=express.Router();

route.use('/bus',busRoutes);
route.use('/trip',tripRoutes);
route.post('/login',companyController.login);

module.exports=route;