var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
	req.session.user = null;
	res.redirect('/posts');
});

module.exports = router;