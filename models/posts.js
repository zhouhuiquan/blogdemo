
// 连接数据库
const db = require('./db');

exports.add = function () {}

// 查找
exports.find = function (page, size, cb) {

	// SELECT * FROM posts;
	// let query = 'SELECT * FROM posts';
	
	// 假定每页固定 2 条数据
	
	// 1  1 ~ 2   0 = (1 - 1) * 2, 2
	// 2  3 ~ 4   2 = (2 - 1) * 2, 2
	// 3  5 ~ 6   4 = (3 - 1) * 2, 2
	// ...        
	// n            = (n - 1) * 2, 2

	// offset 从哪开始取数
	// page   取第几页
	// size   每页几条数据
	let offset = (page - 1) * size;
	let query = 'SELECT p.id, p.title, p.brief, p.time, u.name, u.avatar FROM posts AS p LEFT JOIN users AS u ON p.uid = u.id LIMIT ?, ?'

	db.query(query, [offset, size], (err, rows) => {
		if(!err) {
			// 调用回调
			return cb(null, rows);
		}

		cb(err);
	})
}

// 删除
exports.deleteByid = function (id, cb) {
	// 根据id删除数据
	let query = 'DELETE FROM posts WHERE id = ?';

	db.query(query, id, (err) => {
		if(!err) {
			// 调用回调
			return cb(null);
		}

		cb(err);
	})
}

// 添加文章
exports.addPost = function (data, cb) {

	let query = 'INSERT INTO posts SET ?';

	db.query(query, data, (err) => {
		if(!err) {
			return cb(null);
		}

		cb(err);
	})
}

exports.findOne = function (id, cb) {

	let query = "SELECT * FROM posts AS p LEFT JOIN users AS u ON p.uid = u.id WHERE p.id = ?";

	db.query(query, id, (err, rows) => {
		if(!err) {
			return cb(null, rows);
		}

		cb(err);
	})
}

exports.update = function (data, cb) {

	let query = 'UPDATE posts SET ? WHERE id = ?';

	// 主键
	let id = data.id;

	// 删除主键
	delete data.id;

	db.query(query, [data, id], (err) => {
		if(!err) {
			return cb(null);
		}

		cb(err);
	})
}

// 统计
exports.count = function (cb) {

	let query = 'SELECT count(*) as total FROM posts;';

	db.query(query, (err, rows) => {
		if(!err) {
			return cb(null, rows[0]);
		}

		cb(err);
	})
}