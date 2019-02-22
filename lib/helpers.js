

/* helpers for various tasks

*/
// Dependencies
const crypto = require('crypto');
const config = require('../config');
const https = require('https');
const querystring = require('querystring');
const path = require('path');
const fs = require('fs');


// Containers for all helpers
var helpers = {};


helpers.hash = (str) =>{
  if(typeof(str)== 'string' && str.length > 0){
    const hashStr = crypto.createHmac('sha256', config.hashSecret).update(str).digest('hex');
    return hashStr;
  } else {
    return false

  }

}


helpers.parseJsonToObject = (str)=>{
  try{
    const obj = JSON.parse(str)
    return obj;
  }catch(e){
    return {};
  }

}

helpers.randomString = (strLength)=>{
  var str = '';
  strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
  if(strLength){
    const posibleCharacters = 'abcdefghigklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    
    for(i = 1; i <= strLength; i++){
      const randomCharacter = posibleCharacters.charAt(Math.floor(Math.random() * posibleCharacters.length));
      str+=randomCharacter;
    }
   return str;
  } else {
    return false;
  }
};




module.exports = helpers
 