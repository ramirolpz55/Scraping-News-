/* Scraping News! ** BACKEND
==================== */

// DEPENDANCIES
// ==================== 
var express = require('express');
var path = require('path');
var cheerio = require('cheerio');
var mongoose = require('mongoose');
var request = require('request');
var bodyParser = require('body-parser');
var logger = require('morgan'); // LOGS ALL INFO TO THE TERMINAL 
var index = require('./routes/index');
var debug = require('debug')('test:server');
var http = require('http');
var app = express();

//SETTING THE LOGGER, URLENCODED AND STATIC FOLDER SETUP
//=====================
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));

// DATABASE CONFIGURATION
// ==================== 
// Database configuration with mongoose
mongoose.connect('mongodb://heroku_xkk7sh28:rp3ddrl5ue0a1od0vle1ra28fv@ds145677.mlab.com:45677/heroku_xkk7sh28');
const db = mongoose.connection;

// SHOW ANY MONGOOSE ERROS.
//=====================
db.on('error', function(err) {
    console.log('Mongoose Error: ', err);
});

// ONCE LOGGED INTO THE DATABASE LOG A SUCCESS.
//=====================
db.once('open', function() {
    console.log('Mongoose connection successful.');
});

app.use('/', index);

// CATCH 404 AND FOWARD TO TGE ERROR HANDLER.
//=======================
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // SET LOCALS, ONLY PROVIDING ERROR IN DEVELOPEMTN.
    //===================
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development'
        ? err
        : {};

    // IF ERROR RENDER THE ERROR PAGE
    //====================
    res.status(err.status || 500);
    res.render('error');
});


// VIEW ENGINE WILL BE USING THE HBS HANDLEBARS NPM PACKAGE 
//====================
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// GET PORT FROM ENVIORNMENT AND STORE IN EXPRESS.
//====================
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// THIS CREATES A HTTP SERVER.
//====================
var server = http.createServer(app);

// LISTEN ON PROVIDED PORT, ON ALL NETWORK INTERFACES.
//==================
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// NORMALIZE A PORT INTO A NUMBER, A STRING OR IF IT IS FALSE.
//===================
function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }
    if (port >= 0) {
        // port number
        return port;
    }
    return false;
}
// EVENT LISTENER FOR HTTP SERVER ERROR EVENT.
//====================
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port;

// THIS HANLDES SPECIFIC LISTEN ERRORS.
//======================
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}
// EVENT LISTENER FOR THE HTTP SERVER LISTENING EVENT.
//======================
function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ?
        'pipe ' + addr :
        'port ' + addr.port;
    debug('Listening on ' + bind);
}
// LISTEN ON SPECIFIED PORT 
//=====================
console.log("App listening on port: " + port);