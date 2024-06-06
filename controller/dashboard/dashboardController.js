const offerController=require('./offer/offerController');
const employeeRequestController=require('./employeeRequest/employeeRequestController');
const travelCompanyController=require('./travelCompany/travelCompanyController');
const newsController=require('./news/newsController');
const cityController=require('./city/cityController');
const jwt=require('jsonwebtoken');
const login=async(req,res,next)=>{
    const DB=require('../../util/modelRequire');
    const validation=require('../../validation/methods');
    const userName=req.body.userName;
    const password=req.body.password;
    try{
        //validation
        let isTrue=await validation.isUserName(userName);
        if(isTrue!==true){
            const err=new Error(isTrue);
            err.statusCode=422;
            throw err;
        }
        isTrue=await validation.isPassword(password);
        if(isTrue!==true){
            const err=new Error(isTrue);
            err.statusCode=422;
            throw err;
        }
        //
        const checkAdmin=await DB.comEmploye.findOne({
                where:{email:userName,password:password},
                attributes:['id']
        });
        if(!checkAdmin){
            const err=new Error('user name or password incorrect');
            err.statusCode=422;
            throw err;
        }
        const compAndOffer=await DB.comEmploye.findOne({
            where:{email:userName,password:password},
            attributes:['id'],
            include:[{
                model:DB.companyy,
                attributes:['id','name','image'],
                include:{
                    model:DB.employee,
                    attributes:[
                        'id',
                        'email',
                        'password',
                        'accountType'
                    ]
                }
            },{
                model:DB.offer,
                attributes:[
                    'id',
                    'companyName',
                    'desc',
                    'img'
                ]
            },{
                model:DB.newss,
                attributes:[
                    'id',
                    'img',
                    'desc'
                ]
            },{
                model:DB.cityy,
                where:{isDeleted:false},
                attributes:['id','name']
            }]
        });
        let token=jwt.sign({adminId:checkAdmin.id},'dashboardApp',{expiresIn:'10h'});
        if(!compAndOffer){
                res.status(200).json({
                    token:token,
                    companies:[],
                    offers:[],
                    news:[],
                    cities:[]
                });
        }else{  
                let companies=[];
                if(Array.isArray(compAndOffer.companies))
                        companies=compAndOffer.companies.map(i=>({
                            'id':i.id,
                            'name':i.name,
                            'image':i.image,
                            'employees':i.employees.map(j=>({
                                    'id':j.id,
                                    'email':j.email,
                                    'password':j.password,
                                    'accountType':j.accountType
                            }))
                        }));
                res.status(200).json({
                    token:token,
                    companies:companies,
                    offers:compAndOffer.offers,
                    news:compAndOffer.news,
                    cities:compAndOffer.cities
                });
           }
        }catch(err){
        if(!err.statusCode)
              err.statusCode=500;
        next(err);
    }
};
//travel company
const addCompany=travelCompanyController.addCompany;
const updateCompany=travelCompanyController.updateCompany;
const deleteCompany=travelCompanyController.deleteCompany;
//offer
const addOffer=offerController.addOffer;
const deleteOffer=offerController.deleteOffer;
//employee request
const getEmployeRequest=employeeRequestController.getEmployeRequest;
const deleteEmployeRequest=employeeRequestController.deleteEmployeRequest;
//news
const addNews=newsController.addNews;
const deleteNews=newsController.deleteNews;
//city
const addCity=cityController.addCity;
const deleteCity=cityController.deleteCity;
const getDeletedCity=cityController.getDeletedCity;

module.exports={
   getDeletedCity,
   deleteCity,
   addCity,
   login,
   addCompany,
   addOffer,
   deleteOffer,
   getEmployeRequest,
   deleteEmployeRequest,
   updateCompany,
   deleteCompany,
   addNews,
   deleteNews
}