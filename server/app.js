var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('./config/logger/winston.js');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /client
app.use(favicon(path.join(__dirname, '../client/assets/icon', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/build', express.static(path.join(__dirname, '../build')));
app.use('/public', express.static(path.join(__dirname, '../client')));

//View controller
app.use('/', require('./controllers/public/home-controller'));
app.use('/', require('./controllers/public/login-controller'));
app.use('/', require('./controllers/public/signup-controller'));

//Api controllers
app.use('/', require('./controllers/api/token-controller'));
app.use('/', require('./controllers/api/user-controller'));


// error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  logger.warn(err.message);
  if (err.received === 0 || err.message === 'Not Found'){
    return res.status(404)
              .json( { status: 'error', message: 'Resource not found' } );
  }
  else {
    return res.status(err.status || 400)
              .json( { status: 'error', message: err.message } );
  }
});

module.exports = app;
