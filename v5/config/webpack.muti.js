
const htmlWebackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const path = require('path')
module.exports =  {
     mode:"development",
     entry:{
          index:"./src/main1.js",
          album:"./src/main2.js",
     },
     resolve:{
          extensions:['.js','.json','.vue','.jsx'],
          alias:{
               "@":path.resolve(__dirname,'../src')
          }
     },
     output:{
          filename:"[name].bundle.js"
     },
     plugins:[
          new webpack.DefinePlugin({
               BASE_URL:'"./"'
          }),
          new htmlWebackPlugin({
               title:"index",
               template:'./public/index.html',
               filename:"index.html",
               chunks:["index"]
          }),
          new htmlWebackPlugin({
               title:"album",
               template:'./public/album.html',
               filename:"album.html",
               chunks:["album"]
          }),
     ]
 
  }