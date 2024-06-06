const checkSrting=/(^([a-zA-z](\s)?){1,200}$)|(^((أ|ب|ت|ث|ج|ح|خ|د|ذ|ر|ز|س|ش|ص|ض|ط|ظ|ع|غ|ف|ق|ك|ل|م|ن|ه|هـ|و|ي|ئ|ا|ء|ؤ|ى|ة)(\s)?){1,200}$)/;
const checknumber=/(^([0-9]){1,100}$)|(^(٠|١|٢|٣|٤|٥|٦|٧|٨|٩){1,100}$)/;
const checkDate=/(^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}\s[0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2}$(\.0{3})?)|(^(٠|١|٢|٣|٤|٥|٦|٧|٨|٩){4}-(٠|١|٢|٣|٤|٥|٦|٧|٨|٩){1,2}-(٠|١|٢|٣|٤|٥|٦|٧|٨|٩){1,2}\s(٠|١|٢|٣|٤|٥|٦|٧|٨|٩){1,2}:(٠|١|٢|٣|٤|٥|٦|٧|٨|٩){1,2}:(٠|١|٢|٣|٤|٥|٦|٧|٨|٩){1,2}$(\.(٠){3})?)/;

const checkPhoneNumber=/(^09[0-9]{8}$)|(^(٠٩)(٠|١|٢|٣|٤|٥|٦|٧|٨|٩){8}$)/;
const checkComment=/^(([a-zA-z0-9](\s)?)|((ه|أ|ب|ت|ث|ج|ح|خ|د|ذ|ر|ز|س|ش|ص|ض|ط|ظ|ع|غ|ف|ق|ك|ل|م|ن|هـ|و|ي|ئ|ا|ء|ؤ|ى|ة|٠|١|٢|٣|٤|٥|٦|٧|٨|٩)(\s)?)){0,1500}$/;
const checkIss=/((^[0-9]{11}$)|(^(٠|١|٢|٣|٤|٥|٦|٧|٨|٩){11}$))/;
const checkUserName=/^[a-zA-Z]+[0-9|\.|a-zA-Z]*@[a-zA-Z]+(\.[a-zA-Z]+)*$/;
const checkPassword=/^([a-zA-Z0-9]|!|~|`|@|#|\$|%|\^|&|\*|\(|-|_|=|\+|\)|\]|\[|\}|\{|'|"|;|:|\/|\?|\.|\>|,|\<|\||\\){8,20}$/;
const checkPaymentId=/^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)+$/;
const checkHash=/^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)+$/;
const checkDescription=/^(([a-zA-z0-9](\s)?(%)?(\s)?)|((ه|أ|ب|ت|ث|ج|ح|خ|د|ذ|ر|ز|س|ش|ص|ض|ط|ظ|ع|غ|ف|ق|ك|ل|م|ن|هـ|و|ي|ئ|ا|ء|ؤ|ى|ة|٠|١|٢|٣|٤|٥|٦|٧|٨|٩)(\s)?(%)?(\s)?)){0,20000}$/;
const checkListOfCities=/((^((\s)?[a-zA-z]+(\s)?(,)?){1,50}$)|(^((\s)?(ه|أ|ب|ت|ث|ج|ح|خ|د|ذ|ر|ز|س|ش|ص|ض|ط|ظ|ع|غ|ف|ق|ك|ل|م|ن|هـ|و|ي|ئ|ا|ء|ؤ|ى|ة)+(\s)?(,)?){1,50}$))/;
module.exports={
    checkHash,
    checkListOfCities,
    checkDescription,
    checkPaymentId,
    checkUserName,
    checkPassword,
    checkIss,
    checkDate,
    checkPhoneNumber,
    checkSrting,
    checknumber,
    checkComment
};
//with out arabic
// const checkSrting=/^([a-zA-z](\s)?){1,200}$/;
// const checknumber=/^[0-9]{1,100}$/;
// const checkDate=/^[0-9]{4}-[0-9]{2}-[0-9]{2}\s[0-9]{2}:[0-9]{2}:[0-9]{2}$/;
// const checkPhoneNumber=/^09[0-9]{8}$/;
// const checkComment=/^([a-zA-z0-9](\s)?){0,1500}$/;
// const checkIss=/^[0-9]{11}$/;
// const checkUserName=/^[a-zA-Z]+[0-9|\.|a-zA-Z]*@[a-zA-Z]+(\.[a-zA-Z]+)*$/;
// const checkPassword=/^([a-zA-Z0-9]|!|~|`|@|#|\$|%|\^|&|\*|\(|-|_|=|\+|\)|\]|\[|\}|\{|'|"|;|:|\/|\?|\.|\>|,|\<|\||\\){8,20}$/;
// const checkPaymentId=/^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)+$/;
// const checkHash=/^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)+$/;
// const checkDescription=/^([a-zA-z0-9](\s)?){0,20000}$/;
// const checkListOfCities=/^([a-zA-z](\s)?(,)?){1,1000}$/;
// module.exports={
//     checkHash,
//     checkListOfCities,
//     checkDescription,
//     checkPaymentId,
//     checkUserName,
//     checkPassword,
//     checkIss,
//     checkDate,
//     checkPhoneNumber,
//     checkSrting,
//     checknumber,
//     checkComment
// };