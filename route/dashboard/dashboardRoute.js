const express=require('express');
const route=express.Router();
const offerRoute=require('./offer/offerRoute');
const travelCompanyRoute=require('./travelCompany/travelCompanyRoute');
const employeeRequestRoute=require('./employeeRequest/employeeRequestRoute');
const dashBoardController=require('../../controller/dashboard/dashboardController');
const newsRoute=require('./news/newsRoute');
const companyRequestRoute=require('./companyRequest/companyRequestRoute');
const cityRoute=require('./city/cityRoute');
route.post('/login',dashBoardController.login);
route.use('/offer',offerRoute);
route.use('/travelCompany',travelCompanyRoute);
route.use('/employeeRequest',employeeRequestRoute);
route.use('/companyRequest',companyRequestRoute);
route.use('/news',newsRoute);
route.use('/cities',cityRoute);

module.exports=route;