/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2023-10-07 11:41:32
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2023-10-07 11:52:03
 * @FilePath: /node-server/create-schema-tool/app.js
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
const useRouter = require('./servers/index.js');

// 导入 express
const express = require('express')
//定义路由模块
const router = express.Router() 

// 创建服务器的实例对象
const app = express()

// 挂载路由
useRouter(router)

app.use(router)

// 启动服务器
app.listen(8003, () => {
    console.log('api server running at http://127.0.0.1:8080')
})