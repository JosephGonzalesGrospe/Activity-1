/*
* wroker related task
*
*/

// Dependencies
const path = require('path');
const fs = require('fs');
const _data = require('./data');
const https = require('https');
const http = require('http');
const helpers = require('./helpers');
const url = require('url');
const _logs = require('./logs')
const util = require('util');
const debug = util.debuglog('workers');
// replace console.log() to debug this will just show debug console if NODE_DEBUG=workers node index.js
// normal node index.js will not show the debug log


const workers = {};



// export module
module.exports = workers;

