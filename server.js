/*
 1. 服务器代码
 2. 启动服务器指令:
    npm i nodemon -g
    nodemon server.js 
    或者 
    直接 node server.js
 3.访问服务器地址:
    http://localhost:3000
 */

const express = require('express');

const app = express();

// 中间件:暴露出去build目录,时间有效期为是1个小时
app.use(express.static('build', {
   maxAge: 1000 * 3600
}))
console.log('biubiu123')

app.listen(3000);