/*
primary file of API
*/
/*
scafolding of nodejs
*/
const server = require('./lib/server');

const workers = require('./lib/workers');


const app = {};

// Initialize function
app.init=()=>{
  // start the server
  server.init();
  // start the workers
 
}
app.init();
// export the app
module.exports = app;
