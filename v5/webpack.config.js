const path = require('path')
module.exports = {
     entry:"./src/index.js",
     output:{
          filename:"build.js",
          path:path.resolve(__dirname,'./dist'),
          assetModuleFilename:"img/[name].[hash:6][ext]"
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
               
               {
                    test: /\.(png|jpe?g|gif|svg)$/,   
                    type:"asset/resource",
                    generator:{
                         filename:"img/[name].[hash:6][ext]"
                    }
               }
          ]
     },
 
}