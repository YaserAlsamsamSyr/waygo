let socketIo;
module.exports={
    init:(server=>{
        // socketIo=require('socket.io')(server);
        socketIo=require('socket.io')(server,{
            cors:{
                // origins:["https://moaztello.github.io"],
                origins:["*"],
                methods: ["GET", "POST"],
                credentials: true 
            },
            pingTimeout: 600000
        });
        return socketIo;
    }),
    getSocket:()=>{
        if(!socketIo){ throw new Error('socket not initialized');}
        return socketIo;
    }
};