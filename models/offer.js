const seq=require('../util/db');
const sequelize=require('sequelize');
    const offer=seq.define('offer',{
        companyName:{
            type:sequelize.STRING,
            allowNull:false
        },
        desc:{
            type:sequelize.STRING,
            allowNull:false
        },
        img:{
            type:sequelize.STRING,
            defaultValue:"no image"
        }
    });
module.exports=offer;