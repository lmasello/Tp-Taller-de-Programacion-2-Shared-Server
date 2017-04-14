#!/usr/bin/env node

/**
 * Module dependencies.
 */
var app = require('../server/app');
var debug = require('debug')('node-postgres-promises:server');
var http = require('http');
var logger = require('../server/config/logger/winston.js');
const config = require('../server/config/config');
const orm = require('./../server/config/orm');

/**
 * Get port from environment and store in Express.
 */
var port = config.port;
app.set('port', port);

/**
 * Create HTTP server.
 */
orm.init(app).then(() => {
  var server = http.createServer(app);

  /**
   * Listen on provided port, on all network interfaces.
   */
  server.listen(port, function () {
    logger.info('Server listening on port ' + port);
  });
  server.on('listening', onListening);
  exports.closeServer = function(){
    server.close();
  };

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
}).catch(logger.debug);
