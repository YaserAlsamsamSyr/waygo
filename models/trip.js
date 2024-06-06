const seq=require('../util/db');
const sequelize=require('sequelize');
    const trip=seq.define('trip',{
        ticktPrice:{
            type:sequelize.INTEGER,
            defaultValue:0
        },
        date:{
            type:sequelize.DATE,
            allowNull:false
        }
    });
module.exports=trip;