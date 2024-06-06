const express=require('express');
const dashboardController=require('../../../controller/dashboard/dashboardController');
const uploadImage=require('../../../middleware/image').uploadImage;
const auth=require('../../../middleware/auth').dashboard;
const route=express.Router();

route.post('/addCompany',auth,uploadImage("company").single('image'),dashboardController.addCompany);
route.put('/updateCompany/:id',auth,uploadImage("company").single('image'),dashboardController.updateCompany);
route.delete('/deleteCompany/:id',auth,dashboardController.deleteCompany);

module.exports=route;