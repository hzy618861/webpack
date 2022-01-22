const express = require('express')
const middleware = require('webpack-dev-middleware')
const webpack = require('webpack')
const app = express()

//获取配置文件
const config = require('./webpack.config.js')
const compiler = webpack(config)
//可以把webpack处理完的内容返回给server
app.use(middleware(compiler))
//开启服务
app.listen(3000,()=>{
    console.log('serve at 3000...')
})