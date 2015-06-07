var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var cloudinary = require('cloudinary');

var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());

//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: 'Quiz 2015'
}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// MW de Helpers dinámicos
app.use(function(req,res,next) {
    // si no existe, lo inicializa
    if (!req.session.redir){
        req.session.redir='/';
    }
    
    // guardar path en session.redir para después de login
    if (!req.path.match(/\/login|\/logout|\/user/)) {
        req.session.redir = req.path;
    }

    // hacer visible req.session en las vistas
    res.locals.session = req.session;
    res.locals.cloudinary = cloudinary;
    next();
});

// MW de auto-logout si pasaron más de 2 minutos desde la última transacción de la sesión
app.use(function(req,res,next) {
    var currentTime = new Date().getTime();
    if(req.session.user){
        if( currentTime >= (req.session.user.lastSeen + 120000) )
            delete req.session.user;
        else
            req.session.user.lastSeen = currentTime;
    }
    next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {},
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
