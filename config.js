/*


configuration environtment
staging and production
*/


const environtments = {};


//staging Endvirontment {default}

environtments.staging = {
  'httpPort': 3000,
  'httpsPort': 3001,
  'envName': 'staging',
  'hashSecret': 'mySecret',
  'twilio':{
    'accountSid':'ACb32d411ad7fe886aac54c665d25e5c5d',
    'authToken': '9455e3eb31109edc12e3d8c92768f7a67',
    'fromPhone': '+15005550006'
  },
  'maxChecks': 7
};


environtments.production = {
  'httpPort': 5000,
  'httpsPort': 5001,
  'envName': 'production',
  'hashSecret': 'mySecret',
  'twilio':{
    'accountSid':'ACb32d411ad7fe886aac54c665d25e5c5d',
    'authToken': '9455e3eb31109edc12e3d8c92768f7a67',
    'fromPhone': '+15005550006'
  },
  'maxChecks': 7
};

var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLocaleLowerCase() : '';


//check current environment if not will define to defauls as staging
const environmentToExport = typeof(environtments[currentEnvironment]) == 'object' ? environtments[currentEnvironment] : environtments.staging;



module.exports = environmentToExport;