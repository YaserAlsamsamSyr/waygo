const validation=require('../../../validation/methods');
const DB=require('../../../util/modelRequire');
const addCity=async(req,res,next)=>{
    const adminId=req.adminId;
    const cities=req.body.cities;
    try{
        //validation
        let isTrue=await validation.isnumber(adminId);
        if(isTrue!==true){
            const err=new Error(isTrue);
            err.statusCode=422;
            throw err;
        }
        if(cities.length==0){
            const err=new Error("no city to add");
            err.statusCode=422;
            throw err;
        }
        for(let i=0;i<cities.length;i++){
            isTrue=await validation.isSrting(cities[i]);
            if(isTrue!==true){
                const err=new Error(isTrue);
                err.statusCode=422;
                throw err;
            }
        }
        //
        let allCities=await DB.cityy.findAll({attributes:['id','name','isDeleted']});
        let foundBefore=[];
        let notFoundBefore=[];
        let help=false;
        for(let i=0;i<cities.length;i++){
            for(let j=0;j<allCities.length;j++){
                let nameCity=allCities[j].name.split(',');
                if(allCities[j].isDeleted==true&&nameCity[0]==cities[i]){
                       let updateCity={id:allCities[j].id,name:cities[i],isDeleted:false};
                       foundBefore.push(updateCity);
                       await DB.cityy.update(updateCity,{where:{id:updateCity.id}}); 
                       help=true;
                       break;
                }
                else if(cities[i]==allCities[j].name){
                       foundBefore.push(allCities[j]);
                       help=true;
                       break;
                    }
            }
            help?help=false:notFoundBefore.push(cities[i]);
        }
        if(notFoundBefore.length!=0){
            let admin=await DB.comEmploye.findOne({where:{id:adminId}});
            let newNotFoundBefore=[];
            for(let i=0;i<notFoundBefore.length;i++)
                    newNotFoundBefore.push(await admin.createCity({name:notFoundBefore[i]}));
            if(foundBefore.length!=0)
                allCities=[
                    ...foundBefore.map(i=>({id:i.id,name:i.name})),
                    ...newNotFoundBefore.map(i=>({id:i.id,name:i.name}))
                ];
            else
                allCities=[...newNotFoundBefore.map(i=>({id:i.id,name:i.name}))];
        } else
            allCities=[...foundBefore.map(i=>({id:i.id,name:i.name}))];
        res.status(201).json({cities:allCities});
    }catch(err){
        if(!err.statusCode)
               err.statusCode=500;
            next(err);
    }
};
const deleteCity=async(req,res,next)=>{
    const cityId=req.params.cityId;
    try{
        //validation
        isTrue=await validation.isnumber(cityId);
        if(isTrue!==true){
            const err=new Error(isTrue);
            err.statusCode=422;
            throw err;
        }
        //
        let allCities=await DB.cityy.findAll({where:{isDeleted:false},attributes:['id','name']});
        if(allCities.length==0){
            const err=new Error("no cities");
            err.statusCode=404;
            throw err;
        }
        let cityIndex=-1;
        for(let i=0;i<allCities.length;i++)
            if(allCities[i].id==cityId){
                   cityIndex=i;
                   break;
            }
        if(cityIndex==-1){
            const err=new Error("this city not found");
            err.statusCode=404;
            throw err;
        }
        await allCities[cityIndex].update({name:`${allCities[cityIndex].name},was deleted`,isDeleted:true})
        allCities.splice(cityIndex, 1);
        res.status(200).json({cities:allCities});
    }catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};
const getDeletedCity=async(req,res,next)=>{
    try{
        let deletedCity=await DB.cityy.findAll({where:{isDeleted:true},attributes:['id','name']});
        if(deletedCity.length==0){
            const err=new Error('no deleted city found');
            err.statusCode=404;
            throw err;
        }
        res.status(200).json({cities:deletedCity});
    }catch(err){
        if(!err.statusCode)
           err.statusCode=500;
        next(err);
    }
};
module.exports={
    getDeletedCity,
    addCity,
    deleteCity
};