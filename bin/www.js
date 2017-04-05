#!/usr/bin/env node

/**
 * Module dependencies.
 */
var app = require('../server/app');
var debug = require('debug')('node-postgres-promises:server');
var http = require('http');
var logger = require('../server/config/logger/winston.js');
const config = require('../server/config/config');

/**
 * Get port from environment and store in Express.
 */
var port = config.port;
app.set('port', port);

/**
 * Create HTTP server.
 */
var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, function () {
  logger.info('Server listening on port ' + port);
});
server.on('error', onError);
server.on('listening', onListening);
exports.closeServer = function(){
  server.close();
};
/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(bind + ' requires elevated privileges');
      throw error;
    case 'EADDRINUSE':
      logger.error(bind + ' is already in use');
      throw error;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  logger.debug('Listening on ' + bind);
}
