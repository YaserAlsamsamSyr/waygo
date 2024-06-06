const seq=require('../util/db');
const sequelize=require('sequelize');
    const employee=seq.define('employee',{
        email:{
            type:sequelize.STRING,
            allowNull:false
        },
        password:{
            type:sequelize.STRING,
            allowNull:false
        },
        accountType:{
            type:sequelize.STRING,
            allowNull:false
        }
    });
module.exports=employee;