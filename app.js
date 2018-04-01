
const express = require('express');

// 解析 post 中间件
const bodyParser = require('body-parser');

// 处理 session 中间件
const session = require('express-session');

// 引入子路由
const home = require('./routes/home');

// 引入子路由
const admin = require('./routes/admin');

const app = express();

// 监听端口
app.listen(3000);

// 配置模板引擎
app.set('view engine', 'xtpl');

app.set('views', './views');

// 设置静态资源
app.use(express.static('./public'));

// 中间件（解析 post 数据）
app.use(bodyParser.urlencoded({extended: false}));

// session 配置
app.use(session({
    secret: 'eric',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 3600 * 1000 * 24 * 30
    }
}));

// 当使用了中间件 session 后
// 会在请求上添加 req.session 
// 并且是一个对象
// 此对象记录与 session 和 cookie 
// 的信息

// 可以为此对象添加属性用来保存数据

// 检测是否登录
// 只有访问 /admin 时需要检测
app.use('/admin', (req, res, next) => {
    // 如果登录成功，记录了 req.session.loginfo
    // 如果没有 req.session.loginfi 为 undefined 
    // 则认为未登录
    
    // 把登录信息记录在 locals 中
    // express 中 app.locals 下的属性
    // 可以任意位置被读取，包括模块中
    app.locals.profile = req.session.loginfo;

    if(!req.session.loginfo) {
        // 跳转至登录页
        // return res.redirect('/login');
    }

    // 调用下一个中间件
    next();
})

// 配置前台路由
app.use('/', home);

// 配置后台路由
app.use('/admin', admin);
