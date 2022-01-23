
const webpack = require('webpack')
const htmlWebackPlugin = require('html-webpack-plugin')
const resolveApp = require('./paths')
const {merge} = require('webpack-merge')
const prodConfig = require('./webpack.prod.js')
const devConfig = require('./webpack.dev.js')
const TerserPlugin = require('terser-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();
const commonConfig =  (isPro)=>{
       return  {
          entry:"./src/index.js",
          // entry:{
          //      // main1:{
          //      //      import:"./src/main1.js",
          //      //      dependOn:"lodash"
          //      // },
          //      // main1:{
          //      //      import:"./src/main2.js",
          //      //      dependOn:"lodash"
          //      // },
          //      // lodash:"lodash",
          //      // main1:{
          //      //      import:"./src/main1.js",
          //      //      dependOn:"shared"
          //      // },
          //      // main2:{
          //      //      import:"./src/main2.js",
          //      //      dependOn:"shared"
          //      // },
          //      // shared:['lodash','jquery']
          // },
          resolve:{
               extensions:['.js','.json','.vue','.jsx'],
               alias:{
                    "@":resolveApp('./src')
               }
          },
          output:{
               // filename:"js/build.js",
               filename:"js/[name].build.js", //多入口打包
               path:resolveApp('./dist'),
               //publicPath:'/',  // 域名 + publicPath + filename 进行资源查找
               assetModuleFilename:"img/[name].[hash:6][ext]"
          },
          module: {
               rules:[
                    {
                         test: /\.css$/,   //正则匹配需要处理的文件类型
                         use: [
                              // "style-loader",
                              isPro?MiniCssExtractPlugin.loader:"style-loader",
                              {
                                   loader:"css-loader",
                                   options:{
                                         esModule:false,
                                         importLoaders:1 //css loader工作中又找到了css,往前找一个loader进行处理
                                   }
                              },
                              "postcss-loader"
                         ]
                    },
                    {
                         test: /\.less$/,   
                         use: [
                              'style-loader',
                              'css-loader',
                              'postcss-loader',
                              'less-loader'
                         ]
                    },
                     {
                         test: /\.(png|jpe?g|gif|svg)$/,   
                         type:"asset",
                         generator:{
                              filename:"img/[name].[hash:6][ext]"
                         },
                         parser:{
                              dataUrlCondition:{
                                    maxSize:10*1024
                              }
                         }
                     },
                     {
                         test: /\.(ttf|woff2?)$/,   
                         type:"asset/resource",
                         generator:{
                              filename:"font/[name].[hash:6][ext]"
                         },
                     },
                     {
                         test: /\.jsx?$/,   
                         exclude:/node_modules/,
                         use:["babel-loader"]
                     },
                     {
                         test: /\.ts$/,   
                         use:["babel-loader"]
                     },
                     {
                         test: /\.vue?$/,   
                         use:["vue-loader"]
                     }
                      
               ]
          },
          plugins:[
              new htmlWebackPlugin({
                   title:"首页",
                   template:'./public/index.html'
              }),
              new webpack.DefinePlugin({
                   BASE_URL:'"./"'
              }),
              new webpack.DllReferencePlugin({
                   manifest: resolveApp('./dll/react.manifest.json'),
                   context:resolveApp('./')  //相对manifest如何找目标js
              }),
              new AddAssetHtmlPlugin({ 
                   outputPath:"js",
                   filepath:resolveApp('./dll/dll_react.js')
              }),
              
          ],
          externals:{
               lodash:"_" //key为不希望打包的报名 value为对外暴露的全局变量值
          },
          optimization: {
               minimizer: [new TerserPlugin({
                    extractComments: false
               })],
               // splitChunks:{
               //      chunks: 'all',
               //      // cacheGroups:{
               //      //     syVendors:{
               //      //           test:/[\\/]node_modules[\\/]/,
               //      //           filename:"js/[id]_vendor.js"
               //      //     }
               //      // }
               //      // minSize: 20000,
               //      // minRemainingSize: 0,
               //      // minChunks: 1,
               //      // maxAsyncRequests: 30,
               //      // maxInitialRequests: 30,
               //      // enforceSizeThreshold: 50000,
               // }
          },
      
       }
}
module.exports = (env) => {
     const isProduction = env.production
     process.env.NODE_ENV = isProduction ?'production':"development" 
     //依据打包模式合并配置
     const config = isProduction? prodConfig:devConfig
     const mergeConfig = merge(commonConfig(isProduction),config)
     return smp.wrap(mergeConfig) 
}