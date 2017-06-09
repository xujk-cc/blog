var express  = require('express'),
session      = require('express-session'),
path         = require('path'),
favicon      = require('serve-favicon'),
logger       = require('morgan'),
cookieParser = require('cookie-parser'),
bodyParser   = require('body-parser'),
MongoStore   = require('connect-mongo')(session),
flash        = require('connect-flash'),
config       = require('config-lite')(__dirname),
app          = express(),
routes       = require('./routes/index');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/upload', express.static(path.join(__dirname, 'upload')));

// session中间件
app.use(session({
	name: config.session.key,
	secret: config.session.secret,
	resave: true,
	saveUninitialized: false,
	cookie: {
		maxAge: config.session.maxAge
	},
	store: new MongoStore({
		url: config.mongodb
	})
}));

// 设置模板全局常量
app.locals.blog = {
	title: config.title,
	description: config.description
}

// 路由
routes(app);


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = err;

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
