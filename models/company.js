const seq=require('../util/db');
const sequelize=require('sequelize');
    const company=seq.define('company',{
           name:{
            type:sequelize.STRING,
            allowNull:false
           },
           image:{
            type:sequelize.STRING,
            defaultValue:"no image"
           }
    });
module.exports=company;