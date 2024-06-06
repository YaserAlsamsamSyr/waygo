const seq=require('../util/db');
const sequelize=require('sequelize');
    const employeRequest=seq.define('employeRequest',{
        name:{
            type:sequelize.STRING,
            allowNull:false
        },
        phone:{
            type:sequelize.STRING,
            allowNull:false
        },
        address:{
            type:sequelize.STRING,
            allowNull:false
        },
        homework:{
            type:sequelize.STRING,
            allowNull:false
        }
    });
module.exports=employeRequest;