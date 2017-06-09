var fs = require('fs');
var path = require('path');
var sha1 = require('sha1');
var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var fs = require('fs');
var config = require('../config/default');

var UserModel = require('../models/users');
var checkNotLogin = require('../middlewares/check').checkNotLogin;

// GET /signup 注册页
router.get('/', checkNotLogin, function(req, res, next) {
    res.render('signup');
});

// POST /signup/upload 头像上传
router.post('/upload', function(req, res, next){
    var form = new multiparty.Form();
    form.uploadDir = path.join(config.uploadDir, '/temp');
    form.parse(req, function(err, fields, files){
        if(err){
            return res.json({
                code: -1,
                msg: "上传头像失败, 请重试"
            });
        }
        var src = files.avatar[0].path;
        src = path.join('/upload/temp/', src.split(path.sep).pop());
        res.json({
            code: 0,
            msg: "上传头像成功",
            data: src
        });
    });
});

// POST /signup 用户注册
router.post('/', function(req, res, next) {
        // avatar ? fs.unlink(avatar.path) : '';
    var fields = req.body;
    name       = fields.name,
    gender     = fields.gender,
    bio        = fields.bio,
    avatar     = fields.avatar,
    password   = fields.password,
    repassword = fields.repassword;

    // 校验参数
    try {
        if (!name || !(name.length >= 1 && name.length <= 10)) {
            throw new Error(JSON.stringify({
                code: -1,
                msg: '名字请限制在 1-10 个字符'
            }));
        }
        if (!gender || ['m', 'f', 'x'].indexOf(gender) === -1) {
            throw new Error(JSON.stringify({
                code: -2,
                msg: '性别只能是 m、f 或 x'
            }));
        }
        if (!avatar) {
            throw new Error(JSON.stringify({
                code: -3,
                msg: '缺少头像'
            }));
        }
        if (!password || password.length < 6) {
            throw new Error(JSON.stringify({
                code: -4,
                msg: '密码至少 6 个字符'
            }));
        }
        if (password !== repassword) {
            throw new Error(JSON.stringify({
                code: -5,
                msg: '两次输入密码不一致'
            }));
        }
        if (!bio || !(bio.length >= 1 && bio.length <= 30)) {
            throw new Error(JSON.stringify({
                code: -6,
                msg: '个人简介请限制在 1-30 个字符'
            }));
        }
    } catch (e) {
        // 注册失败
        return res.json(JSON.parse(e.message));
    }

    // 明文密码加密
    password = sha1(password);

    // 头像存储
    var src = path.join(config.rootDir, avatar);
    var suffix = src.split('.').pop();
    var timer = new Date().getTime().toString();
    var random = Math.floor(Math.random() * 10000).toString();
    var newName = timer + random + '.' + suffix;
    var newSrc = path.join(config.uploadDir, 'avatar', newName);

    // 待写入数据库的用户信息
    var user = {
        name: name,
        password: password,
        gender: gender,
        bio: bio,
        avatar: path.join('/upload/avatar', newName)
    };
    // 用户信息写入数据库
    UserModel.create(user)
        .then(function(result) {
            user = result.ops[0];
            // 将用户信息存入 session
            delete user.password;
            req.session.user = user;

            // 头像移入正式文件夹
            fs.rename(src, newSrc);

            res.json({
                code: 0,
                msg: '注册成功',
                data: '/posts'
            });
        })
        .catch(function(e) {
            // 用户名被占用
            if (e.code == 11000) {
                return res.json({
                    code: -7,
                    msg: '用户名已被占用'
                });
            }
            res.json({
                code: -8,
                msg: '注册失败, 请重试'
            });
        });

});

module.exports = router;
