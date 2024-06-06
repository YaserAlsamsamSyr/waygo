const seq=require('../util/db');
const sequelize=require('sequelize');
    const customer=seq.define('customer',{
          firstName:{
            type:sequelize.STRING,
            allowNull:false
          },
          lastName:{
            type:sequelize.STRING,
            allowNull:false
          },
          fatherName:{
            type:sequelize.STRING,
            allowNull:false
          },
          motherName:{
            type:sequelize.STRING,
            allowNull:false
          },
          gender:{
            type:sequelize.STRING,
            allowNull:false
          },
          iss:{
            type:sequelize.STRING,
            allowNull:true
          },
          isOwner:{
            type:sequelize.BOOLEAN,
            defaultValue:false
          }
    });
module.exports=customer;