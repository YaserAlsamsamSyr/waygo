const express=require('express');
const route=express.Router();
const auth=require('../../../middleware/auth').dashboard;
const dashBoardController=require('../../../controller/dashboard/dashboardController');

route.post('/addCity',auth,dashBoardController.addCity); 
route.delete('/deleteCity/:cityId',auth,dashBoardController.deleteCity);
route.get('/getDeletedCity',auth,dashBoardController.getDeletedCity);

module.exports=route;