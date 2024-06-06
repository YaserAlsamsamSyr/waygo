const rules=require('./rules');
const isSrting=(toValid)=>{
   return new Promise((resolve,reject)=>{
       !rules.checkSrting.test(toValid)?
            resolve(`${toValid} is not valid, must be string (a to z) and maximum 200 characters`)
            :
            resolve(true);
   });
};
const isnumber=(toValid)=>{
    return new Promise((resolve,reject)=>{
        !rules.checknumber.test(toValid)?
            resolve(`${toValid} is not valid, must be numbers and 100 digits maximum`)
            :
            resolve(true);
    });
};
const isDate=(toValid)=>{
    return new Promise((resolve,reject)=>{
        !rules.checkDate.test(toValid)?
            resolve(`date ${toValid} is not valid`)
            :
            resolve(true);
    });
};
const isPhoneNumber=(toValid)=>{
    return new Promise((resolve,reject)=>{
        !rules.checkPhoneNumber.test(toValid)?
            resolve(`PhoneNumber ${toValid} is not valid, must be like the form 09******** and 10 digits`)
            :
            resolve(true);
    });
};
const isComment=(toValid)=>{
    return new Promise((resolve,reject)=>{
        !rules.checkComment.test(toValid)?
            resolve(`comment is not valid, must be string and numbers just and maximum 1500 characters`)
            :
            resolve(true);
    });
};
const isIss=(toValid)=>{
    return new Promise((resolve,reject)=>{
        !rules.checkIss.test(toValid)?
            resolve(`iss is not valid, must be numbers and maximum 11 digits`)
            :
            resolve(true);
    });
};
const isPassword=(toValid)=>{
    return new Promise((resolve,reject)=>{
        !rules.checkPassword.test(toValid)?
            resolve('password invalid , must be from 8 to 20 characters')
            :
            resolve(true)
        ;
    });
};
const isUserName=(toValid)=>{
    return new Promise((resolve,reject)=>{
        !rules.checkUserName.test(toValid)?
            resolve('username invalid , must be like the form [a-zA-Z][.|0-9|a-zA-Z]?@[a-zA-Z](.[a-zA-Z])?')
            :
            resolve(true)
        ;
    });
};
const isPaymentId=(toValid)=>{
    return new Promise((resolve,reject)=>{
        !rules.checkPaymentId.test(toValid)?
           resolve("paymentId invalid")
           :
           resolve(true)
        ;
    });
};
const iSDescription=(toValid)=>{
    return new Promise((resolve,reject)=>{
        !rules.checkDescription.test(toValid)?
        resolve("description must be string and numbers and maximum 20,000 characters")
        :
        resolve(true)
        ;
    });
};
const isListOfCities=(toValid)=>{
    return new Promise((resolve,reject)=>{
        !rules.checkListOfCities.test(toValid)?
        resolve("cities must be string and maximum 50 cities can be added and like the form (**** , **** , ...)")
        :
        resolve(true)
        ;
    });
};
const isHash=(toValid)=>{
    return new Promise((resolve,reject)=>{
        !rules.checkHash.test(toValid)?
        resolve("Hash invalid")
        :
        resolve(true)
        ;
    });
};
module.exports={
    isHash,
    isListOfCities,
    iSDescription,
    isPaymentId,
    isUserName,
    isPassword,
    isSrting,
    isnumber,
    isDate,
    isPhoneNumber,
    isComment,
    isIss
};