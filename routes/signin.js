var express = require('express');
var router = express.Router();
var checkNotLogin = require('../middlewares/check').checkNotLogin;
var UserModel = require('../models/users');
var sha1 = require('sha1');

router.get('/', checkNotLogin, function(req, res, next){
	res.render('signin');
});

router.post('/', checkNotLogin, function(req, res, next){
	var name = req.body.name,
	password = req.body.password;

	console.log(name)

	password = sha1(password);
	var user = {
		name: name,
		password: password
	}

	try{
		if(!name){
			throw new Error(JSON.stringify({
				code: -1,
				msg: '用户名不能为空'
			}));
		}
		if(!password){
			throw new Error(JSON.stringify({
				code: -2,
				msg: '密码不能为空'
			}));
		}
	}catch(e){
		return res.json(JSON.parse(e.message));
	}

	UserModel.find(user)
		.then(function(result){

			if(result.length == 0){
				res.json({
					code: -3,
					msg: "用户名或密码错误"
				});
			}else{
				user = result;
				delete user.password;
	            // 将用户信息存入 session
				req.session.user = user;
				res.json({
					code: 0,
					msg: "登录成功",
					data: '/posts'
				});
			}
		})
		.catch(function(err){
			res.json({
				code: -4,
				msg: "登录失败, 请重试"
			});
		});
});

module.exports = router;
