const seq=require('../util/db');
const sequelize=require('sequelize');
    const userAccount=seq.define('userAccount',{
        phoneNumber:{
            type:sequelize.STRING,
            allowNull:false
        }
    });
module.exports=userAccount;