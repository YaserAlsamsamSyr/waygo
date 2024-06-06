const {parentPort}=require('worker_threads');
const checkDate=require('./checkDate');
parentPort.once("message",trips=>{
trips=trips.map(i=>{
    return{
        "buse":i.bus,
        "id":i.id,
        "from":i.from.name,
        "to":i.to.name,
        "ticktPrice":i.ticktPrice,
        "date":i.date,
    };
});
let oldTrips=[];
for(i=0;i<trips.length;i++){
    if(!checkDate(trips[i].date))
         oldTrips.push(trips[i]);
}
let validTrips=[];
for(i=0;i<trips.length;i++){
    if(checkDate(trips[i].date))
        validTrips.push(trips[i]);
}
parentPort.postMessage(oldTrips,validTrips);
});