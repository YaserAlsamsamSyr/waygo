const deleteImage=require('../../../middleware/image').deleteImage;
const DB=require('../../../util/modelRequire');
const validation=require('../../../validation/methods');
const socket=require('../../../webSocket').getSocket;
const addOffer=async(req,res,next)=>{
    const companyName=req.body.companyName;
    const desc       =req.body.desc;
    const img   =!req.file?"no image":req.file.path;
    const adminId    =req.adminId;
    try{
        //validation
        let isTrue=await validation.isSrting(companyName);
        if(isTrue!==true){
            const err=new Error(isTrue);
            err.statusCode=422;
            throw err;
        }
        isTrue=await validation.iSDescription(desc);
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
        const admin=await DB.comEmploye.findOne({
            where:{id:adminId},
            attributes:['id'],
            include:{
                model:DB.offer,
                attributes:['id','companyName','desc','img']
            }
        });
        let newOffer=await admin.createOffer({
            companyName:companyName,
            desc:desc,
            img:img
        });
        let offers=admin.offers;
        offers.push({
            id:newOffer.id,
            companyName:companyName,
            desc:desc,
            img:img
        });
        socket().emit('newOffer',{newOffer:{
            id:newOffer.id,
            companyName:companyName,
            desc:desc,
            img:img
        }});
        res.status(201).json({offers:offers});
    }catch(err){
        if(!err.statusCode)
             err.statusCode=500;
        next(err);
    }
};
const deleteOffer=async(req,res,next)=>{
    const offerId=req.params.id;
    const adminId=req.adminId;
    try{
        //validation
        let isTrue=true;
        let allNumberArr=[offerId,adminId];
        for(let i=0;i<allNumberArr.length;i++){    
            isTrue=await validation.isnumber(allNumberArr[i]);
            if(isTrue!==true){
                const err=new Error(isTrue);
                err.statusCode=422;
                throw err;
            }
        }
        //
        const admin=await DB.comEmploye.findOne({
            where:{id:adminId},
            attributes:['id'],
            include:{
                model:DB.offer,
                attributes:[
                    'id',
                    'companyName',
                    'desc',
                    'img'
                ]
            }
        });
        let offers=admin.offers;
        if(offers.length==0){
            const err=new Error("no offers to delete");
            err.statusCode=404;
            throw err;
        }
        let isOfferFound={yesOrNo:false,indexOffer:-1};
        for(let i=0;i<offers.length;i++){
            if(offers[i].id==offerId){
                isOfferFound.yesOrNo=true;
                isOfferFound.indexOffer=i;
                break;
            }         
        }
        if(!isOfferFound.yesOrNo){
            const err=new Error("this offer not found");
            err.statusCode=404;
            throw err;
        }
        await offers[isOfferFound.indexOffer].destroy();
        if(offers[isOfferFound.indexOffer].img.toUpperCase()!="NO IMAGE"){
            deleteImage(offers[isOfferFound.indexOffer].img);
        }
        offers.splice(isOfferFound.indexOffer,1);
        res.status(200).json({offers:offers});
    }catch(err){
        if(!err.statusCode)
              err.statusCode=500;
        next(err);
    }
};

module.exports={
    addOffer,
    deleteOffer
};