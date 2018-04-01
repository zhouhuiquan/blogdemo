
const mysql = require('mysql');

const md5 = require('md5');

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    port: 3306,
    database: 'blog'
});

db.md5 = md5;

// 开放
module.exports = db;