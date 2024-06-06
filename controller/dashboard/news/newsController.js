const deleteImage=require('../../../middleware/image').deleteImage;
const DB=require('../../../util/modelRequire');
const validation=require('../../../validation/methods');
const socket=require('../../../webSocket').getSocket;
const addNews=async(req,res,next)=>{
    try {
        const desc=req.body.desc;
        const img=!req.file?"no image":req.file.path;
        const adminId=req.adminId;
        //validation
        let isTrue=await validation.iSDescription(desc);
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
        let admin=await DB.comEmploye.findOne({
            where:{id:adminId},
            include:{
                model:DB.newss,
                attributes:['id','img','desc']
            }
        });
        let newNews=await admin.createNews({desc:desc,img:img});
        if(!newNews){
            const err=new Error('there is an error');
            err.statusCode=403;
            throw err;
        }
        let news=admin.news;
        news.push({id:newNews.id,desc:newNews.desc,img:newNews.img});
        socket().emit('newNews',{newNews:{id:newNews.id,desc:newNews.desc,img:newNews.img}});
        res.status(201).json({news:news});
    } catch (err) {
        if(!err.statusCode)
              err.statusCode=500;
        next(err);
    }
};
const deleteNews=async(req,res,next)=>{
    const newsId=req.params.id;
    const adminId=req.adminId;
    try{
        //validation
        let allNumberArr=[newsId,adminId];
        let isTrue=true;
        for(let i=0;i<allNumberArr.length;i++){
            isTrue=await validation.isnumber(allNumberArr[i]);
            if(isTrue!==true){
                const err=new Error(isTrue);
                err.statusCode=422;
                throw err;
            }
        }
        //
        let news=await DB.comEmploye.findOne({
            where:{id:adminId},
            include:{
                model:DB.newss,
                attributes:['id','img','desc']
            }
        });
        if(news.news.length==0){
            const err=new Error('no news to delete');
            err.statusCode=404;
            throw err;
        }
        let isFoundNews={state:false,index:-1};
        for(let i=0;i<news.news.length;i++)
            if(news.news[i].id==newsId){
                  isFoundNews.state=true;
                  isFoundNews.index=i;
                  break;
            }
        if(!isFoundNews.state){
            const err=new Error('this news not found');
            err.statusCode=404;
            throw err;
        }
        let image=news.news[isFoundNews.index].img;
        await news.news[isFoundNews.index].destroy();
        if(image.toUpperCase()!="NO IMAGE"){
            deleteImage(image);
        }
        news.news.splice(isFoundNews.index,1);
        res.status(200).json({news:news.news});
    }catch(err){
        if(!err.statusCode)
               err.statusCode=500;
        next(err);
    }
};

module.exports={
    addNews,
    deleteNews
};