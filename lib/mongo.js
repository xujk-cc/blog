var config = require('config-lite')(__dirname),
Mongolass  = require('mongolass'),
mongolass  = new Mongolass();

mongolass.connect(config.mongodb);

var User = mongolass.model('User', {
    name: { type: 'string' },
    password: { type: 'string' },
    avatar: { type: 'string' },
    gender: { type: 'string', enum: ['m', 'f', 'x'] },
    bio: { type: 'string' }
});
User.index({ name: 1 }, { unique: true }).exec();// 根据用户名找到用户，用户名全局唯一
exports.User = User;
