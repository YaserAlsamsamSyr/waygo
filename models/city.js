const seq=require('../util/db');
const sequelize=require('sequelize');
    const city=seq.define('city',{
        name:{
            type:sequelize.STRING,
            allowNull:false
        },
        isDeleted:{
            type:sequelize.BOOLEAN,
            defaultValue:false
        }
    });
module.exports=city;