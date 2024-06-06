const seq=require('../util/db');
const sequelize=require('sequelize');
    const reservation=seq.define('reservation',{
        totalPrice:{
            type:sequelize.INTEGER,
            defaultValue:0
        },
        numberOfSets:{
            type:sequelize.INTEGER,
            defaultValue:0
        },
        bookedFrom:{
            type:sequelize.STRING,
            defaultValue:"no reservation"    
        },
        rate:{
            type:sequelize.INTEGER,
            allowNull:true    
        },
        comment:{
            type:sequelize.STRING,
            allowNull:true    
        },
        chearNum:{
            type:sequelize.STRING,
            allowNull:false
        },
        paymentId:{
            type:sequelize.STRING,
            allowNull:false
        },
        terminalId:{
            type:sequelize.BIGINT,
            allowNull:false
        },
        paymentType:{
            type:sequelize.STRING,
            allowNull:false
        },
        ownerId:{
            type:sequelize.INTEGER,
            allowNull:false    
        },
    });
module.exports=reservation;