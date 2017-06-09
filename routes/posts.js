var express = require('express'),
router      = express.Router(),
checkLogin  = require('../middlewares/check').checkLogin;

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.locals.isLogin = !!req.session.user;
	res.render('index');
});

module.exports = router;
