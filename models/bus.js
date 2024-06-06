const seq=require('../util/db');
const sequelize=require('sequelize');
    const bus=seq.define('bus',{
        type:{
          type:sequelize.STRING,
          allowNull:false   
        },
        numOfSets:{
            type:sequelize.INTEGER,
            allowNull:false
        },
        driverName:{
            type:sequelize.STRING,
            allowNull:false
        },
        helpDriverName:{
            type:sequelize.STRING,
            defaultValue:'no one'
        },
        numberOfBus:{
            type:sequelize.STRING,
            allowNull:false
        }
    });
module.exports=bus;