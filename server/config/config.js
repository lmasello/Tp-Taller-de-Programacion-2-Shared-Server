const env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const path = require('path');
const rootPath = path.normalize(__dirname + '/../../');

var allConfigurations = {
    local: {
        appName: 'shared-server',
            rootPath: rootPath,
            port: process.env.PORT || 3000,
            logger : {
            name : "shared-server | (Local)"
        },
        postgres: {
            uri : 'postgres://postgres:123456@localhost:5432/music-io-shared-server_development'
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
            uri : 'postgres://postgres:123456@localhost:5432/music-io-shared-server_development'
        }
    },
    staging: {
        appName: 'shared-server',
            rootPath: rootPath,
            port: process.env.PORT || 3000,
            logger : {
            name : "shared-server | (Staging)"
        }
    },
    production: {
        appName: 'shared-server',
            rootPath: rootPath,
            port: process.env.PORT || 3000,
            logger : {
            name : "shared-server | (Production)"
        }
    }
};

module.exports = allConfigurations[env];