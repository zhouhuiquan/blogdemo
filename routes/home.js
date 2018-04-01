
const express = require('express');

const moment = require('moment');

const users = require('../models/users');

const posts = require('../models/posts');

// 创建子路由
const home = express.Router();

home.get('/', (req, res) => {
    // res.send('前台首页');
    // 获得页码
    let page = req.query.page || 1;
    // 每页数据条数
    let size = req.query.size || 2;

    posts.find(page, size, (err, rows) => {
        // 处理日期
        rows.forEach(function (val, key) {
            rows[key].time = moment(rows[key].time).format('DD MMMM YYYY');
        });

        // 统计
        posts.count((err, row) => {
            // console.log(row)
            // 渲染页面
            res.render('home/index', {
                posts: rows,
                page: page,
                total: Math.ceil(row.total / size)
            });
        })
    })
});

// 退出登录
home.get('/logout', (req, res) => {
    req.session.loginfo = null;
    // 跳转至前台首页
    // Ajax 不支持跳转
    // res.redirect('/');
    
    res.json({
        code: 10000,
        msg: '退出成功!'
    });
});

// 登录页面
home.get('/login', (req, res) => {
    res.render('home/login', {});
})

// 登录逻辑
home.post('/login', (req, res) => {
    // console.log(req.body);
    
    // 调用user模型来验证
    users.auth(req.body, (err, loginfo) => {
        // console.log(err);
        
        if(!err) {
            // 登录成功
            
            // 记录 session
            // req.session.loginfo = '111';
            req.session.loginfo = loginfo;

            return res.json({
                code: 10000,
                msg: '登录成功!'
            });
        }

        // 登录失败
        res.json({
            code: 10001,
            msg: '用户名或密码错误!'
        })
    });

})

// 注册页面
home.get('/register', (req, res) => {
    // 静态页面渲染
    res.render('home/register', {});
})

// 注册逻辑
home.post('/register', (req, res) => {
    console.log(req.body);

    // 注册用户
    users.addUser(req.body, (err) => {
        // console.log(err);
        if(!err) {
            res.json({
                code: 10000,
                msg: '注册成功!'
            })
        }
    });

});

// 查看文章详情
home.get('/article', (req, res) => {
    // console.log(req.query);
    
    posts.findOne(req.query.id, (err, row) => {
        if(!err) {
            res.render('home/article', {post: row[0]})
        }
    })
})

home.get('/demo', (req, res) => {
    res.send('前台demo首页');
});

module.exports = home;
