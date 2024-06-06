const express=require('express');
const auth=require('../../../middleware/auth').dashboard;
const uploadImage=require('../../../middleware/image').uploadImage;
const dashBoardController=require('../../../controller/dashboard/dashboardController');
const route=express.Router();

route.post('/addNews',auth,uploadImage("news").single('image'),dashBoardController.addNews);
route.delete('/deleteNews/:id',auth,dashBoardController.deleteNews);

module.exports=route;