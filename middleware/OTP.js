const OTP=require('otp-generator');
const crypto=require('crypto');
const key="wayGoOtp";

const getOTP=(params,callback)=>{
        const otp=OTP.generate(4,{
          upperCaseAlphabets:false,
          lowerCaseAlphabets:false,
          specialChars:false
        });
        const ttl=5*60*1000;
        const expires=(new Date()).getTime()+ttl;
        const data=`${params.phoneNumber}.${otp}.${expires}`;
        const hash=crypto.createHmac("sha256",key).update(data).digest("hex");
        const fullHash=`${hash}.${expires}`;
        // send SMS
        console.log(otp);
        return callback(null,fullHash,otp);
};
const verifyOTP=(params,callback)=>{
    let [fullHash,expires]=params.hash.split(".");
    if((new Date()).getTime()>expires)
            return callback("otp expired");
    const data=`${params.phoneNumber}.${params.otp}.${expires}`;
    const hash=crypto.createHmac("sha256",key).update(data).digest("hex");
    if(fullHash==hash)
        return callback(null,"success");
    return callback("invalid OTP");
};

module.exports={
    getOTP,
    verifyOTP
};