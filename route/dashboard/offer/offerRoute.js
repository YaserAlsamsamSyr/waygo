const express=require('express');
const auth=require('../../../middleware/auth').dashboard;
const dashboardController=require('../../../controller/dashboard/dashboardController');
const uploadImage=require('../../../middleware/image').uploadImage;
const route=express.Router();

route.post('/addOffer',auth,uploadImage("offer").single('image'),dashboardController.addOffer);
route.delete('/deleteOffer/:id',auth,dashboardController.deleteOffer);

module.exports=route;