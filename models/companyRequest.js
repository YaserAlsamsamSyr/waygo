const seq=require('../util/db');
const sequelize=require('sequelize');
    const companyRequest=seq.define('companyRequest',{
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
        cities:{
            type:sequelize.STRING,
            allowNull:false
        }
    });
module.exports=companyRequest;