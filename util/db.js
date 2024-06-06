const sequelize=require('sequelize');
const seq=new sequelize({
     host: 'localhost',
     username: 'root',
     password: '',
     database: 'wayGo',
     dialect: 'mysql',
     dialectModule: require('mysql2'),
     benchmark: true 
});

// host: 'sql9.freesqldatabase.com',
// username: 'sql9649330',
// password: 'LarseLZNbk',
// database: 'sql9649330',
// dialect: 'mysql',
// dialectModule: require('mysql2'),
// benchmark: true 

module.exports=seq;