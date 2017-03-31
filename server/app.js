var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('./config/logger/winston.js');
//controllers
var user = require('./controllers/user-controller');
var token = require('./controllers/token-controller');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//server.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', user);
app.use('/', token);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    logger.error(err.message);
    next(err);
});

// error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    logger.error(err.message);
    res.status(err.status || 500)
       .json( { status: 'error', message: err.message } );
});

module.exports = app;
