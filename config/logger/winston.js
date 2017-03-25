var winston = require('winston');
var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: function() {
        return new Date().toISOString();
      },
      level: 'info'
    }),
    new (winston.transports.File)({
      timestamp: function() {
        return new Date().toISOString();
      },
      level: 'warn',
      filename: 'logfile.log'
    })
  ]
});
logger.cli();
module.exports = logger;
