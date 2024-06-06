const seq=require('../util/db');
const sequelize=require('sequelize');
    const chear=seq.define('chear',{
        number:{
            type:sequelize.INTEGER,
            allowNull:false
        }
    });
module.exports=chear;