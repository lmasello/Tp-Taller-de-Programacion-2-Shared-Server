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
    res.status(err.status || 400)
       .json( { status: 'error', message: err.message } );
});

module.exports = app;
