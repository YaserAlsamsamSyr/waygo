const express=require('express');
const bodyParser=require('body-parser');
const DB=require('./util/db');
require('./util/tabelRelation');
const socketIo=require('./webSocket');
const Routes=require('./route/wayGoRoutes');
const path=require('path');
const app=express();
// const cors=require('cors');
// app.use(cors({ origin: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','POST,GET,DELETE,PUT,PATCH');
    res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');
    next();
});
app.use('/images',express.static(path.join(__dirname,'images')));
app.use(Routes);
app.use((error,req,res,next)=>{
    res.status(error.statusCode).json({message:error.message});
});
(async()=>{
    try{
        await DB.sync();
        const server=app.listen(19991,async()=>{
            console.log('server started success with database server');
        });
        socketIo.init(server).on('connection',socket=>{
            console.log('client connected');
            socket.on('disconnect',()=>{
                console.log(`client ${socket.id} disconneted`);
            })
            // socket.on('re_msg',(msg)=>{
            //     console.log(`client ${socket.id} send '${msg}'`);
            // })
        });
        let chears=require('./models/chear');
        if((await chears.findAll()).length==0){
            let s=[];
            for(let i=1;i<=70;i++)
               s.push({number:i});
            await chears.bulkCreate(s)?
            console.log("70 chears added success"):'';
        } else 
            console.log("chears added before now");
    }catch(err){
        if(!err.statusCode)
           err.statusCode=500;
        console.log('can`t connect to database');
        console.log(err);
    }
})();

// notic //
// tow query at once statment ==>> 
// const [ productsPromise, variationProductsPromise ] = await { Product.findAll(), VariationProduct.findAll()}