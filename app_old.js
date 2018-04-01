
const express = require('express');

const app = express();

app.listen(3000, () => {
    // 
});

app.set('view engine', 'xtpl');

app.set('views', './views');

app.use(express.static('./public'));

// 后台主路由
// app.use('/admin', (req, res, next) => {
//     res.send('你来到了后台网站！');
// });

// 前台主路由
// app.use('/', (req, res, next) => {
//     res.send('你来到了前台网站！');
// });

// 主路由和子路由

// 在Express中使用 Router 来创建一个子路由

const home = express.Router();

const admin = express.Router();

app.use('/', home);

app.use('/admin', admin);

// app.get('/', (req, res) => {
//     res.send('hell Express!');
// });

