const seq=require('../util/db');
const sequelize=require('sequelize');
    const companyCities=seq.define('companyCities',{});
module.exports=companyCities;