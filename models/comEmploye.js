const seq=require('../util/db');
const sequelize=require('sequelize');
    const comEmploye=seq.define('comEmploye',{
        email:{
            type:sequelize.STRING,
            allowNull:false
        },
        password:{
            type:sequelize.STRING,
            allowNull:false
        },
        firstName:{
            type:sequelize.STRING,
            allowNull:false
        },
        lastName:{
            type:sequelize.STRING,
            allowNull:false
        },
        phone:{
            type:sequelize.STRING,
            allowNull:false
        },
        accountType:{
            type:sequelize.STRING,
            allowNull:false
        }
    });
module.exports=comEmploye;