const deleteImage=require('../../../middleware/image').deleteImage;
const DB=require('../../../util/modelRequire');
const validation=require('../../../validation/methods');
const addCompany=async(req,res,next)=>{
        // employees:[{
        // email:,
        // password:,
        // accountType:
        // },...]
    const adminId=req.adminId;
    const name     =req.body.name     ;
    const image    =!req.file?"no image":req.file.path;
    const employees=req.body.employees;
    const cities=req.body.cities;
    try{
        // validation
        let isTrue=await validation.isnumber(adminId);
        if(isTrue!==true){
            const err=new Error(isTrue);
            err.statusCode=422;
            throw err;
        }
        isTrue=await validation.isSrting(name);
        if(isTrue!==true){
            const err=new Error(isTrue);
            err.statusCode=422;
            throw err;
        }
        for(let i=0;i<employees.length;i++){
            isTrue=await validation.isUserName(employees[i].email);
            if(isTrue!==true){
                const err=new Error(isTrue);
                err.statusCode=422;
                throw err;
            }
            isTrue=await validation.isPassword(employees[i].password);
            if(isTrue!==true){
                const err=new Error(isTrue);
                err.statusCode=422;
                throw err;
            }
            isTrue=await validation.isSrting(employees[i].accountType);
            if(isTrue!==true){
                const err=new Error(isTrue);
                err.statusCode=422;
                throw err;
            }
        }
        if(cities.length==0){
            const err=new Error('no cities to add');
            err.statusCode=422;
            throw err;
        }
        for(let i=0;i<cities.length;i++){
            isTrue=await validation.isnumber(cities[i].id);
            if(isTrue!==true){
                const err=new Error(isTrue);
                err.statusCode=422;
                throw err;
            }
            isTrue=await validation.isSrting(cities[i].name);
            if(isTrue!==true){
                const err=new Error(isTrue);
                err.statusCode=422;
                throw err;
            }
        }
        //
        let checkCity=await DB.cityy.findAll({where:{name:cities.map(i=>i.name)}});
        if(checkCity.length==0){
            const err=new Error('one or all city not found');
            err.statusCode=404;
            throw err;
        }
        const admin=await DB.comEmploye.findOne({
            where:{id:adminId},
            attributes:['id'],
            include:{
                model:DB.companyy,
                attributes:['id','name']
            }
        });
         for(let i=0;i<admin.companies.length;i++) {
              if(admin.companies[i].name==name) {
                const err=new Error('this company exists before');
                err.statusCode=422;
                throw err;
            }      
        }
        let company=await admin.createCompany({name:name,image:image});
        let emp=await DB.employee.bulkCreate(employees);  
        await company.addEmployees(emp);
        await company.addCities(cities.map(i=>i.id));
        company=await admin.getCompanies({
            attributes:['id','name','image'],
            include:[{
                model:DB.employee,
                attributes:['id','email','password','accountType']
            },{
                model:DB.cityy,
                where:{isDeleted:false},
                attributes:['id','name']
            }]
        });
        company=company.map(i=>({
                id:i.id,
                name:i.name ,
                image: i.image,
                employees:i.employees.map(j=>({
                        id:j.id,
                        email:j.email,
                        password:j.password,
                        accountType:j.accountType
                })),
                cities:i.cities.map(j=>({
                        id:j.id,
                        name:j.name
                }))
        }));
        res.status(201).json({companies:company});
    }catch(err){
        if(!err.statusCode)
           err.statusCode=500;
        next(err);
    }
};
const updateCompany=async(req,res,next)=>{
    const companyId=req.params.id;
    const name=req.body.name;
    const image=!req.file?"no image":req.file.path;
    const employees=req.body.employees;
    const adminId=req.adminId;
    const cities=req.body.cities;
    // employees:[{
    // id:,
    // email:,
    // password:,
    // accountType:
    // },...]
    try{
        //validation
        let isTrue=await validation.isnumber(companyId);
        if(isTrue!==true){
            const err=new Error(isTrue);
            err.statusCode=422;
            throw err;
        }
        isTrue=await validation.isSrting(name);
        if(isTrue!==true){
            const err=new Error(isTrue);
            err.statusCode=422;
            throw err;
        }
        for(let i=0;i<employees.length;i++){
            isTrue=await validation.isnumber(employees[i].id);
            if(isTrue!==true){
                const err=new Error(isTrue);
                err.statusCode=422;
                throw err;
            }
            isTrue=await validation.isUserName(employees[i].email);
            if(isTrue!==true){
                const err=new Error(isTrue);
                err.statusCode=422;
                throw err;
            }
            isTrue=await validation.isPassword(employees[i].password);
            if(isTrue!==true){
                const err=new Error(isTrue);
                err.statusCode=422;
                throw err;
            }
            isTrue=await validation.isSrting(employees[i].accountType);
            if(isTrue!==true){
                const err=new Error(isTrue);
                err.statusCode=422;
                throw err;
            }
        }
        isTrue=await validation.isnumber(adminId);
        if(isTrue!==true){
            const err=new Error(isTrue);
            err.statusCode=422;
            throw err;
        }
        if(cities.length==0){
            const err=new Error('no cities to add');
            err.statusCode=422;
            throw err;
        }
        for(let i=0;i<cities.length;i++){
            isTrue=await validation.isnumber(cities[i].id);
            if(isTrue!==true){
                const err=new Error(isTrue);
                err.statusCode=422;
                throw err;
            }
            isTrue=await validation.isSrting(cities[i].name);
            if(isTrue!==true){
                const err=new Error(isTrue);
                err.statusCode=422;
                throw err;
            }
        }
        //
        let company=(await DB.comEmploye.findOne({
            attributes:['id'],
            where:{id:adminId},
            include:{
                model:DB.companyy,
                attributes:['id','name','image'],
                include:[{
                    model:DB.employee,
                    attributes:['id','email','password','accountType']
                },{
                    model:DB.cityy,
                    where:{isDeleted:false},
                    attributes:['id','name']
                }]
            }
        })).companies;
        if(company.length==0){
            const err=new Error('no company to update');
            err.statusCode=404;
            throw err;
        }
        let indexCompany=-1;
        for(let i=0;i<company.length;i++)
               if(company[i].id==companyId){
                    indexCompany=i;   
                    break;
                    }
        if(indexCompany==-1){
            const err=new Error('this company not found');
            err.statusCode=404;
            throw err;
        }
        let isFoundSameName=-1;
        for(let i=0;i<company.length;i++){
            if(indexCompany==i)
                continue;   
            if(company[i].name==name){
                isFoundSameName=i;   
                break;
            }
        }
        if(isFoundSameName!=-1){
            const err=new Error('this company name is exist before');
            err.statusCode=404;
            throw err;
        }
        let imageToDelete=company[indexCompany].image.toUpperCase();
        company[indexCompany].name=name;
        company[indexCompany].image=image;
        await company[indexCompany].save();
        if(imageToDelete!="NO IMAGE")
            deleteImage(imageToDelete);
        for(let i=0;i<company[indexCompany].employees.length;i++){
            company[indexCompany].employees[i].email=employees[i].email;
            company[indexCompany].employees[i].password=employees[i].password;
            company[indexCompany].employees[i].accountType=employees[i].accountType;
            await company[indexCompany].employees[i].save();
        }
        await company[indexCompany].setCities(cities.map(i=>i.id));
        // await company[indexCompany].addCities();
        company[indexCompany].cities=cities;
        company[indexCompany].employees=employees;
        company=company.map(i=>({
            id:i.id,
            name:i.name,
            image:i.image,
            employees:employees.map(j=>({
                id:j.id,
                email:j.email,
                password:j.password,
                accountType:j.accountType
            })),
            cities:i.cities.map(j=>({id:j.id,name:j.name}))
        }));
        res.status(200).json({companies:company});
    }catch(err){
        if(!err.statusCode)
              err.statusCode=500;
        next(err);
    }
};
const deleteCompany=async(req,res,next)=>{
    const companyId=req.params.id;
    const adminId=req.adminId;
    try{ 
        //validation
        let isTrue=await validation.isnumber(companyId);
        if(isTrue!==true){
            const err=new Error(isTrue);
            err.statusCode=422;
            throw err;
        }
        isTrue=await validation.isnumber(adminId);
        if(isTrue!==true){
            const err=new Error(isTrue);
            err.statusCode=422;
            throw err;
        }
        //
        let companies=(await DB.comEmploye.findOne({
            attributes:['id'],
            where:{id:adminId},
            include:{
                model:DB.companyy,
                attributes:['id','name','image'],
                include:[{
                    model:DB.employee,
                    attributes:['id','email','password','accountType']
                },{
                    model:DB.cityy,
                    where:{isDeleted:false},
                    attributes:['id','name']
                },{
                    model:DB.trip,
                    attributes:['id']
                },{
                    model:DB.bus,
                    attributes:['id']
                }
            ]
            }
        })).companies;
        if(companies.length==0){
            const err=new Error('no company to delete');
            err.statusCode=404;
            throw err;
        }
        let isFoundCompany={state:false,index:-1};
        for(let i=0;i<companies.length;i++)
            if(companies[i].id==companyId){
                isFoundCompany.state=true;
                isFoundCompany.index=i;
                break;
            }
        if(!isFoundCompany.state){
            const err=new Error('this company not found');
            err.statusCode=404;
            throw err;
        }
        let image=companies[isFoundCompany.index].image;
        await companies[isFoundCompany.index].destroy();
        for(let i=0;i<companies[isFoundCompany.index].employees.length;i++)
               await companies[isFoundCompany.index].employees[i].destroy();
        for(let i=0;i<companies[isFoundCompany.index].trips.length;i++)
               await companies[isFoundCompany.index].trips[i].destroy();
        for(let i=0;i<companies[isFoundCompany.index].buses.length;i++)
               await companies[isFoundCompany.index].buses[i].destroy();
        if(image.toUpperCase()!="NO IMAGE"){
            deleteImage(image);
        }
        companies.splice(isFoundCompany.index,1);
        companies=companies.map(i=>({
            id:i.id,
            name:i.name,
            image:i.image,
            employees:i.employees.map(j=>({
                id:j.id,
                email:j.email,
                password:j.password,
                accountType:j.accountType
            })),
            cities:i.cities.map(j=>({id:j.id,name:j.name}))
        }));
        res.status(200).json({companies:companies});
    }catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};
module.exports={
    addCompany,
    updateCompany,
    deleteCompany
};