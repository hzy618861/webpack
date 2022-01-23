const path = require('path')
const {DefinePlugin} = require('webpack')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const htmlWebackPlugin = require('html-webpack-plugin')
const copyWebpackPlugin = require('copy-webpack-plugin')
const reactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const babelLoader = require('babel-loader')
module.exports = {
     mode:"development",
     devtool:"source-map",
     entry:"./src/index.js",
     resolve:{
          extensions:['.js','.json','.vue','.jsx'],
          alias:{
               "@":path.resolve(__dirname,'src')
          }
     },
     output:{
          filename:"js/build.js",
          path:path.resolve(__dirname,'./dist'),
          //publicPath:'/',  // 域名 + publicPath + filename 进行资源查找
          assetModuleFilename:"img/[name].[hash:6][ext]"
     },
     target:"web", //屏蔽browserslist,防止冲突
     devServer:{
          hot:true,
         
     },
     module: {
          rules:[
               {
                    test: /\.css$/,   //正则匹配需要处理的文件类型
                    use: [
                         "style-loader",
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
               // {
               //      test: /\.(png|jpe?g|gif|svg)$/,   
               //      use: [
               //           // {
               //           //      loader:'file-loader',
               //           //      options:{
               //           //           // name:"[name].[hash:6].[ext]",
                              
               //           //           // outputPath:"img",
               //           //           //简写
               //           //           name:"img/[name].[hash:6].[ext]",
               //           //           /*文件输出名 
               //           //             *[ext]: 扩展名
               //           //             *[name] 原样输出
               //           //             *[hash] :文件内容hash 
               //           //             *[contentHash]
               //           //           */
               //           //           esModule:false  //不转为esModule，文件require引入就不用使用.default
               //           //      }
               //           // },
               //           {
               //                loader:'url-loader',
               //                options:{
               //                     limit:"30*1024",
               //                     name:"img/[name].[hash:6].[ext]",
               //                     esModule:false  //不转为esModule，文件require引入就不用使用.default
               //                }
               //           }
               //      ]
               // }
               
               // {
               //      test: /\.(png|jpe?g|gif|svg)$/,   
               //      type:"asset/resource",
               //      generator:{
               //           filename:"img/[name].[hash:6][ext]"
               //      }
               // }
               // {
               //      test: /\.(png|jpe?g|gif|svg)$/,   
               //      type:"asset/inline",
               // }
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
         new CleanWebpackPlugin(),
         new htmlWebackPlugin({
              title:"首页",
              template:'./public/index.html'
         }),
         new DefinePlugin({
              BASE_URL:'"./"'
         }),
         new  copyWebpackPlugin({
              patterns:[
                   {
                        from:"public",
                        globOptions:{
                             ignore:['**/index.html']
                        }
                   }
              ]
         }),
         new reactRefreshWebpackPlugin()
  
     ]
 
}