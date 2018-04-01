
let db = require('./db');

// 添加一个用户
// INSERT INTO users SET ?
// callback 简写成 cb
exports.addUser = (data, cb) => {
    let query = 'INSERT INTO users SET ?';

    // 密码加密处理
    data.pass = db.md5(data.pass);

    db.query(query, data, (err) => {
        if(!err) {
            // console.log('添加用户成功!');
            return cb(null);
        }

        cb(err);
    })
}

// 验证用户
exports.auth = function (data, cb) {

    // 根据条件查询数据库
    
    // 1.
    // SELECT * FROM users WHERE email = 参数;
    // 查询结果中包含密码信息
    
    // 2.
    // 根据参数 判断 密码 是否正确

    // SQL语句
    let query = 'SELECT * FROM users WHERE email = ?';

    // db.md5(data.pass);

    db.query(query, [data.email], (err, rows) => {
        if(!err) {

            // 校验密码
            if(rows[0].pass == db.md5(data.pass)) {
                // 执行回调
                return cb(null, rows[0]);
            }

            // 执行回调
            return cb({msg: '密码或邮箱错误!'});
        }

        // 执行回调
        cb(err);
    });

}

// 删除一个用户

// 修改一个用户
exports.update = (data, id, cb) => {
    // UPDATE users SET ?
    let query = 'UPDATE users SET ? WHERE id = ?';

    db.query(query, [data, id], (err) => {
        if(!err) {
            return cb(null);
        }

        cb(err);
    })
}
