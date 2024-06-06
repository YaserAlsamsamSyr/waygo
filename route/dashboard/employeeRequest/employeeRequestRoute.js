const express=require('express');
const auth=require('../../../middleware/auth').dashboard;
const dashboardController=require('../../../controller/dashboard/dashboardController');
const route=express.Router();

route.get('/getEmployeRequest',auth,dashboardController.getEmployeRequest);
route.delete('/deleteEmployeRequest/:id',auth,dashboardController.deleteEmployeRequest);

module.exports=route;