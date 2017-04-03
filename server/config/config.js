const env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const path = require('path');
const rootPath = path.normalize(__dirname + '/../../');
const logger = require('./logger/winston.js');
/*
 * Load env variables
 */
if (env == 'development' || env == 'test'){
 require('dotenv').load();
}

var allConfigurations = {
    test: {
        appName: 'shared-server',
            rootPath: rootPath,
            port: process.env.PORT || 3000,
            logger : {
            name : "shared-server | (Local)"
        },
        postgres: {
            uri : process.env.DATABASE_URL
        }
    },
    development: {
        appName: 'shared-server',
            rootPath: rootPath,
            port: process.env.PORT || 3000,
            logger : {
            name : "shared-server | (Development)"
        },
        postgres: {
            uri : process.env.DATABASE_URL || 'postgres://postgres:123456@localhost:5432/music-io-shared-server_development'
        }
    },
    staging: {
        appName: 'shared-server',
            rootPath: rootPath,
            port: process.env.PORT || 3000,
            logger : {
            name : "shared-server | (Staging)"
        },
        postgres: {
          uri : process.env.DATABASE_URL
        }
    },
    production: {
        appName: 'shared-server',
            rootPath: rootPath,
            port: process.env.PORT || 3000,
            logger : {
            name : "shared-server | (Production)"
        },
        postgres: {
          uri : process.env.DATABASE_URL
        }
    }
};
logger.debug(allConfigurations[env]);
module.exports = allConfigurations[env];
