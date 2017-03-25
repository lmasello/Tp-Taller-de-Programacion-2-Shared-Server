const env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const path = require('path');
const rootPath = path.normalize(__dirname + '/../../');

/*
 * Load env variables
 */
if (env == 'development' || env == 'test'){
 require('dotenv').load();
}

console.log(process.env.DATABASE_URL);

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
            uri : process.env.DATABASE_URL
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

module.exports = allConfigurations[env];
