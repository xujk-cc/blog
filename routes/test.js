let express = require('express');
let router = express.Router();
let Mongolass = require('mongolass');
let mongolass = new Mongolass();
mongolass.connect('mongodb://localhost:27017/myblog');

router.get('/', (req, res, next)=>{
	let User = mongolass.model('User');
	User.find().exec().then((result)=>{
		console.log(result);
	});
	console.log('test');
	res.status(200).send('test');
})

module.exports = router;