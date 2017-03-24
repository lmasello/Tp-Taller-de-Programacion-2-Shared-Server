const path = require('path');
const rootPath = path.normalize(__dirname + '/../../');

module.exports = {
    development: {
        appName: 'shared-server',
        rootPath: rootPath,
        port: process.env.PORT || 3000,
        logger : {
            name : "shared-server | (Development)"
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