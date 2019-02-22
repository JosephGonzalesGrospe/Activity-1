/*
*
* Server related task
*/
//dependencies
const http = require('http');
const https = require('https')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder;
const fs = require('fs')
const config = require('../config');
const _data =require('./data');
const handlers =require('./handlers');
const helpers = require('./helpers');
const path =require('path');
const util = require('util');
const debug = util.debuglog('workers');
// replace console.log() to debug this will just show debug console if NODE_DEBUG=workers node index.js
// normal node index.js will not show the debug log

const server = {};
//TESTING data
// _data.create('test', 'newFile', {'test':'string'}, (err)=>{
//   console.log("this was the err", err)
// })

//  read data
// _data.read('test', 'newFile', (err, data)=>{
//   console.log("this was the err", err, "data of ", data)
// })
//  update data
// _data.update('test', 'newFile', {'ooo': 'aaaa'}, (err)=>{
//   console.log("this was the err", err)
// })
//  delete data
// _data.delete('test', 'newFile', (err)=>{
//   console.log("this was the err", err)
// })

//  ===============================
//  === send messege twilio api ===
//  ===============================
// helpers.sendTotwilios('4158375309','hello this is a text messege from 9976513159', (err)=>{

//   console.log("if false sms was send error was False!",JSON.stringify(err))
// })


// all the server logic for both the http and https server
var unifiedServer = (req, res) =>{
  
  const parsedURL = url.parse(req.url,true); //important for getting info

  //get the path
  const path = parsedURL.pathname;

  const trimPath = path.replace(/^\/+|\/+$/g,'');
  
  //get headers 
  const headers = req.headers;
  //this where things palyed well
 
  //Get the query
  const queryStringObject = parsedURL.query;
  //get http method
  const method = req.method.toLowerCase();



  //get the payload
  const decoder = new StringDecoder('utf-8');
  var buffer = '';
  req.on('data', (data)=>{
    buffer += decoder.write(data)
   
  });
  req.on('end', ()=>{
    buffer += decoder.end();

      //choosen handle else notFound
  
      const choosenHandler = typeof(router[trimPath]) !== 'undefined' ? router[trimPath] : handlers.notFound;
      //construct data object send to handlers
      const data = {
        'trimPath': trimPath,
        'queryStringObject': queryStringObject,
        'method': method,
        'headers': headers,
        'payload': helpers.parseJsonToObject(buffer)
      };

      //route the reques to the handler specify in the router
      choosenHandler(data, function(statusCode, payload, contentType){

        // Determine the type of the response (fallback to JSON)
        contentType = typeof(contentType) == 'string' ? contentType : 'json';

        // use the status code
        statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
       
     
        //return the response parts that are content-specific
        let payloadString = '';
        if(contentType == 'json'){
          res.setHeader('Content-Type', 'application/json');
          payload = typeof(payload) == 'object' ? payload : {};
          //converted to string the payload
          payloadString = JSON.stringify(payload);
        }
        if(contentType == 'html'){
          res.setHeader('Content-Type', 'text/html');
          payloadString = typeof(payload) == 'string' ? payload : '';
        }

        // return the response-parts that are common to all content-types
        res.writeHead(statusCode);
        res.end(payloadString);
        
        if(statusCode == 200){
          debug('\x1b[32m%s\x1b[0m', 'Returning this response : ', method.toUpperCase()+' /' + trimPath+' '+statusCode);
        } else {
          debug('\x1b[35m%s\x1b[0m', 'Returning this response : ', method.toUpperCase()+' /' + trimPath+' '+statusCode);
        }
        
      })


   
  })

};


//setting port for HTTP
const httpPort = config.httpPort
// initiate HTTP server
server.httpServer = http.createServer((req, res)=>{
  unifiedServer(req, res);
}); //end of server
//start HTTP server


//setting port for HTTPS
const httpsPort = config.httpsPort

const httpsServerOptions = {
  'key' : fs.readFileSync('./https/key.pem'),
  'cert' : fs.readFileSync('./https/cert.pem')
};
// initiate HTTPS server
server.httpsServer = https.createServer(httpsServerOptions, (req, res)=>{
  unifiedServer(req, res);
}); //end of server
//start HTTPS server



handlers.notFound = (data, callback) =>{
  callback(404, {"messege": "Your Request Not found!"})

}

// Router
const router = {
  'api/users': handlers.users,
}

// init script
server.init = ()=>{
// start the HTTP server
  server.httpServer.listen(httpPort, ()=>{
    console.log('\x1b[32m%s\x1b[0m', "listening to HTTP Port " + httpPort + " environment of",config.envName + " mode")
  });
// start the HTTPS server
  server.httpsServer.listen(httpsPort, ()=>{
    console.log('\x1b[36m%s\x1b[0m' ,"listening to HTTPS Port " + httpsPort + " environment of",config.envName + " mode")
  });
};


/// openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem --> to create cert for https



module.exports = server;