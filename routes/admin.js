
const express = require('express');

const path = require('path');

// 处理posts的模型
const posts = require('../models/posts');

// 处理数据的用户模型
const users = require('../models/users');

// 文件上传
const multer = require('multer');

// 文件上传器（基本使用）
// let upload = multer({dest: 'uploads/'});

// 定制使用
let storage = multer.diskStorage({
    // 自定义存储位置
    destination: function (req, file, cb) {
        let root = path.join(__dirname, '..');
        // 自定义路径
        cb(null, path.join(root, 'public/uploads'));
    },

    // 自定义文件名称
    filename: function (req, file, cb) {
        // 文件后缀
        let ext = path.extname(file.originalname);

        cb(null, file.fieldname + '-' + Date.now() + ext);
    }
})

let upload = multer({storage: storage})

// 创建子路由
const admin = express.Router();

// 首页页面
admin.get('/', (req, res) => {
    // console.log(req.session);
    // res.send('后台首页');
    res.render('admin/index', {});
})

// 个人中心页面
admin.get('/settings', (req, res) => {
    // 查询用户的信息
    // 在登录时已将登录者的信息记录在了 
    // session，可以“偷懒”直接使用 session 中的数据
    res.render('admin/settings', {loginfo: req.session.loginfo});
})

// 个人中心
admin.post('/settings', (req, res) => {
    // console.log(req.body);

    // 从session中取出用户的id
    let id = req.session.loginfo.id;

    users.update(req.body, id, (err) => {
        console.log(err);
        
        if(!err) {
            return res.json({
                code: 10000,
                msg: '更新成功!'
            });
        }

        // 
        res.json({
            code: 10002,
            msg: '更新失败!'
        })
    });
})

// 接收上传的文件
admin.post('/profile', upload.single('avatar'), function (req, res, next) {
    // req.file 是 `avatar` 文件的信息
    // req.body 将具有文本域数据，如果存在的话
    // console.log(req.file);

    res.json({
        code: 10000,
        path: path.join('uploads', req.file.filename)
    })
})

// 文章管理（添加页面）
admin.get('/blog/add', (req, res) => {
    res.render('admin/add', {action: '/admin/add'});
})

// 添加文章
admin.post('/add', (req, res) => {
    // console.log(req.body);
    // 从session读取作者的id，通过 uid 字段
    // 接收（因为数据库通过 uid 记录作者的id）
    req.body.uid = req.session.loginfo.id;

    req.body.time = new Date;
    posts.addPost(req.body, (err) => {
        if(!err) {
            res.json({
                code: 10000,
                msg: '添加成功'
            })
        }
    })
})

// 文章管理（列表页面）
admin.get('/blog/list', (req, res) => {
    
    // 调用模型取数据
    // 获得页码
    let page = req.query.page || 1;
    // 每页数据条数
    let size = req.query.size || 2;

    // 
    posts.find(page, size, (err, rows) => {
        // console.log(rows);
        
        posts.count((err, row) => {
            console.log(row);

            if(!err) {
                res.render('admin/list', {
                    posts: rows,
                    page: page,
                    total: Math.ceil(row.total / size)
                });
            }
        })
    });
});

admin.get('/delete', (req, res) => {
    // console.log(req.query);
    // 调用模型删除文章
    posts.deleteByid(req.query.id, (err) => {
        if(!err) {
            res.json({
                code: 10000,
                msg: '删除成功'
            });
        }
    });
});

// 文章管理（文章编辑页面）
admin.get('/edit', (req, res) => {

    // 通过模型取出数据，然后渲染
    posts.findOne(req.query.id, (err, rows) => {
        // console.log(rows)
        if(!err) {
            res.render('admin/add', {
                post: rows[0],
                action: '/admin/update'
            });
        }
    })
});

// 更新文章
admin.post('/update', (req, res) => {
    // console.log(req.body);

    posts.update(req.body, (err) => {
        if(!err) {
            res.json({
                code: 10000,
                msg: '修改成功'
            });
        }
    })
})

admin.use('/demo', (req, res, next) => {
    res.send('后台demo首页');
}, (req, res, next) => {
    next()
}, (req, res, next) => {
    next();
})


module.exports = admin;