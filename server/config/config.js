const env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const path = require('path');
const rootPath = path.join(__dirname, '/../../');
const appName = 'shared-server';
const port = process.env.PORT || 3000;
const dbURI = process.env.DATABASE_URL;
var logger = require('./logger/winston.js');
/*
 * Load env variables
 */
if (env === 'development' || env === 'test'){
  require('dotenv').load();
}

var allConfigurations = {
  test: appConfig(appName, rootPath, port, 'shared-server | (Local)', dbURI),
  development: appConfig(appName, rootPath, port, 'shared-server | (Development)', dbURI),
  staging: appConfig(appName, rootPath, port, 'shared-server | (Staging)', dbURI),
  production: appConfig(appName, rootPath, port, 'shared-server | (Production)', dbURI)
};

function appConfig(appName, rootPath, port, loggerName, dbURI){
  return {
      appName: 'shared-server',
      rootPath: rootPath,
      port: process.env.PORT || 3000,
      logger : { name : "shared-server | (Production)" },
      postgres: { uri : process.env.DATABASE_URL },
      secret: process.env.JWT_SECRET_KEY
  }
}
logger.debug(allConfigurations[env]);
module.exports = allConfigurations[env];
