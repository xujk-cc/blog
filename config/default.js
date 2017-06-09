var path = require('path');

module.exports = {
	title: "博客",
	description: '博客xujk',
	rootDir: path.join(__dirname, '../'),
	uploadDir: path.join(__dirname, '../upload'),
	port: 3000,
	session: {
		secret: 'myblog',
		key: 'myblog',
		maxAge: 2592000000
	},
	mongodb: 'mongodb://localhost:27017/myblog'
};
