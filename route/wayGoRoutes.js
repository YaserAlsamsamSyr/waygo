const express=require('express');
const route=express.Router();
const companyRoutes=require('./company/companyRoutes');
const mobileRoutes=require('./mobile/mobileRoute');
const dashBoardRoutes=require('./dashboard/dashboardRoute');
const webRoutes=require('./web/webRoute');

route.use('/company',companyRoutes);
route.use('/customer',mobileRoutes);
route.use('/dashBoard',dashBoardRoutes);
route.use('/web',webRoutes);
route.get('/',(req,res,next)=>{
    res.status(200).send(
      "<br><br><h1 style='font-size:40px;'> welcome to <i style='color:red;'>wayGo</i></h1>"+
      "<h2 style='color:navy;'>powred by :</h2>"+
      "<h4>Yaser alsamsam (server)</h4>"+
      "<h4>Moaz tello (web)</h4>"+
      "<h4>Wassem kaskas (mobile)</h4>"+
      "<h4>Ahmad obaid (desktop)</h4>"
    );
  });
// route.post('/createAdminForAllProject',async(req,res,next)=>{
//    const admin=require('../models/comEmploye');
//    const email=req.body.email;
//    const password=req.body.password;
//    const firstName=req.body.firstName;
//    const lastName=req.body.lastName;
//    const phone=req.body.phone;
//    const accountType=req.body.accountType;
//    try{
//    await admin.create({
//       email:      email,   
//       password:   password,  
//       firstName:  firstName, 
//       lastName:   lastName  ,
//       phone:      phone   ,
//       accountType:accountType
//    });
//    res.status(201).json({message:"email created"});
//    }catch(err){
//     if(!err.statusCode)
//         err.statusCode=500;
//     next(err);
//    }
// });  
// route.put('/updateAdminForAllProject/:id',async(req,res,next)=>{
//     const admin=require('../models/comEmploye');
//     const id=req.params.id;
//     const email=req.body.email;
//     const password=req.body.password;
//     const firstName=req.body.firstName;
//     const lastName=req.body.lastName;
//     const phone=req.body.phone;
//     const accountType=req.body.accountType;
//     try{
//           await admin.update({
//              email:      email,   
//              password:   password,  
//              firstName:  firstName, 
//              lastName:   lastName  ,
//              phone:      phone   ,
//              accountType:accountType
//           },{where:{id:id}});
//           res.status(201).json({message:"email updated",profile:
//                 {
//                    id:id,
//                    email:      email,   
//                    password:   password,  
//                    firstName:  firstName, 
//                    lastName:   lastName  ,
//                    phone:      phone   ,
//                    accountType:accountType
//                  }
//           });
//     }catch(err){
//          if(!err.statusCode)
//              err.statusCode=500;
//          next(err);
//     }
// });  

module.exports=route;