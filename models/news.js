const seq=require('../util/db');
const sequelize=require('sequelize');
    const news=seq.define('news',{
        desc:{
            type:sequelize.STRING,
            allowNull:false
        },
        img:{
            type:sequelize.STRING,
            defaultValue:"no image"
        }
    });
module.exports=news;