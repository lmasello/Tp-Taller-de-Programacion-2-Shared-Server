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

//Api controllers
app.use('/', require('./controllers/user-controller'));
app.use('/', require('./controllers/token-controller'));

//View controller
app.use('/', require('./controllers/login-controller'));



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        logger.error(err.message);
        res.status( err.code || 500 )
            .json({
                status: 'error',
                message: err.message
            });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    logger.error(err.message);
    res.status(err.status || 500)
        .json({
            status: 'error',
            message: err.message
        });
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    logger.error(err.message);
    res.render('error');
});

module.exports = app;
