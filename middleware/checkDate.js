module.exports=(date)=>{
    let dateNow=new Date();
    dateNow=dateNow.getTime()+(3*60*60*1000);
    date=date.getTime();
    return date>dateNow?true:false;
};