const config = require('../config/config');
var jwt = require('express-jwt');

module.exports = jwt({secret: config.secret});