/*

library for storing data and editing data

*/
const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');
// container for MODULE
var lib = {};

lib.baseDir = path.join(__dirname,'/../.data/');
//write data to file
lib.create = function(dir,file,data,cb){
  //open the file for writing
  console.log("===>  directory of ",dir," file ", file, "data of ", data )
  fs.open(lib.baseDir+dir+'/'+file+'.json','wx', function(err,fileDescriptor){
    console.log(err)
    console.log("filedescriptor ===> ", fileDescriptor)
    if(!err && fileDescriptor){
      //convert data to string for json
      var stringData = JSON.stringify(data);

      //write file and close it
      fs.writeFile(fileDescriptor, stringData, function(err){
        if(!err){
          fs.close(fileDescriptor, function(err){
            if(!err){
              cb(false)
            }else{
              cb('Error closing file!')
            }
          })
        }else{
          cb('error writing new file')
        }
      })
    }else{
      cb('Could not create new file may already exist/ path may also not exist')
    }
  })


};

lib.sample = function(data, callback){
  callback(data)
}

// read data from file
lib.read = function(dir, file, cb){
  fs.readFile(lib.baseDir+dir+'/'+file+'.json','utf8', (err,data)=>{
    if(!err && data){
      const parseData = helpers.parseJsonToObject(data)
      cb(false, parseData)
    }else{
      cb(err, data)
    }
  
  });
};

//read and update data

lib.update = function(dir, file, data, cb){
  //open the file for writing
  fs.open(lib.baseDir+dir+'/'+file+'.json','r+', (err, fileDescriptor)=>{
    if(!err && fileDescriptor){
      var stringData = JSON.stringify(data);
      fs.truncate(fileDescriptor, (err)=>{
        if(!err){
          // write the file and close it
          fs.writeFile(fileDescriptor, stringData, (err)=>{
             if(!err){
              cb(false)
             } else {
              cb('Error closing file!')
             }
          })
        } else {
          cb('Error updating file!')
        }
      })
    }else {
      cb('Could not open file to update')
    }
  });
};

// Deleting Data

lib.delete = function(dir, file, cb){
  fs.unlink(lib.baseDir+dir+'/'+file+'.json',(err)=>{
    if(!err){
      cb(false)
    } else {
      cb('Could not delete')
    }
  })
}

// list of all item directory
lib.list = (dir, callback)=>{
  fs.readdir(lib.baseDir+dir+'/', (err, data)=>{
    if(!err && data && data.length > 0){
      const trimmedFiledNames = [];
      data.forEach(fileName => {
        trimmedFiledNames.push(fileName.replace('.json',''));
      });
      callback(false, trimmedFiledNames)
    } else {
      callback(400)
    }
  })
}

module.exports = lib;