const express=require('express');
const webController=require('../../controller/web/webController');
const route=express.Router();

route.post('/sendEmployeRequest',webController.sendEmployeRequest);
route.post('/sendAddCompanyRequest',webController.sendAddCompanyRequest);
route.post('/searchFroTrips',webController.searchFroTrips);

module.exports=route;