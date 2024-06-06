const seq=require('../util/db');
const sequelize=require('sequelize');
const bookedChear=seq.define('bookedChear',{
        isBooked:{
            type:sequelize.STRING,
            defaultValue:"no"
        },
        bookingDate:{
            type:sequelize.DATE,
            allowNull:true
        }
    });
module.exports=bookedChear;