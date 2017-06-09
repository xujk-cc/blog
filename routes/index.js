module.exports = function(app){
	app.get('/', function(req, res, next){
		res.redirect('posts');
	});
	app.use('/signup', require('./signup'));
	app.use('/signin', require('./signin'));
	app.use('/signout', require('./signout'));
	app.use('/posts', require('./posts'));

	app.use('/test', require('./test'));

	// catch 404 and forward to error handler
	app.use(function(req, res, next) {
		if(!res.headersSent){
			var err = new Error('Not Found');
			err.status = 404;
			next(err);
		}
	});
}
