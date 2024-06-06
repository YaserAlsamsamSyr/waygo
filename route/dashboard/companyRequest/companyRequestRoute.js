const express=require('express');
const auth=require('../../../middleware/auth').dashboard;
const companyRequestController=require('../../../controller/dashboard/companyRquest/companyRequestController');
const app=express.Router();

app.get('/getCompanyRequest',auth,companyRequestController.getCompanyRequest);
app.delete('/deleteCompanyRequest/:id',auth,companyRequestController.deleteCompanyRequest);

module.exports=app;