# webpack5
## 安装 
1. 全局安装 npm i webpack webpack-cli  -g   运行webpack  
2. 局部安装 npm i webpack webpack-cli -D    局部运行npx  webpack  自动去找node_modules下的.bin下的webpack
vscode运行webpack报错问题   webpack : 无法加载文件 C:\Users\hzy\AppData\Roaming\npm\webpack.ps1，因为在此系统上禁止运行脚本。
解决方案： 管理员运行power shell : 输入  Set-ExecutionPolicy RemoteSigned  输入Y确认即可

## 运行webpack  
- 默认会在当前文件夹下找src/index.js作为入口进行打包 输出到dist/main.js

## webpack 配置
1. 命令行带配置  npx  webpack  --entry  ./src/main.js  --output-path ./build
2. package.json配置命令
```
 "scripts": {
    "build":"webpack  --entry  ./src/main.js  --output-path ./build",
  }
```
执行 npm run build 打包
3. 配置文件方式
默认为webpack.config.js  output必须为绝对路径  __dirname 总是指向被执行 js 文件的绝对路径
```
const path = require('path')
module.exports = {
     entry:"./src/index.js",
     output:{
          filename:"build.js",
          path:path.resolve(__dirname,'dist')
     }
}
```
package.json
```
"scripts": {
    "build2":"webpack"
  }
```

4. 自定义配置文件名称
```
 "build3":"webpack --config  webpack.custom.js",
```

5. loader (处理非js模块内容)


## css loader 
- 将css处理为js能识别的模块类型
1. 行内方式使用  css-loader!  
```
import 'css-loader!../css/login.css'

```
2. 配置文件中使用loader

```
   module: {
          rules:[
               {
                  test: /\.css$/,   //正则匹配需要处理的文件类型
                  use: [
                       {
                            loader: 'css-loader'
                       }
                  ]     
               },
               //简写方案1
               {
                    test: /\.css$/,   //正则匹配需要处理的文件类型
                    loader: 'css-loader'
               },
               //简写方案2
               {
                    test: /\.css$/,   //正则匹配需要处理的文件类型
                    use: ['css-loader']
               }
          ]
     }
```

## style-loader  
生成style标签把css-loader处理好的内容嵌入到页面中
- loader默认从右往左执行 先要css-loader处理，在经过style-loader处理
```
   {
                    test: /\.css$/,  
                    use: ['style-loader','css-loader']
               }
```

## less-loader
- 依赖于less  npm i less -D 负责把less文件转换为css
- less-loader  
```
               {
                    test: /\.less$/,   
                    use: ['style-loader','css-loader','less-loader']
               }
```
## browserslist
- 根据配置查看符合条件的浏览器平台数据
1. browserslistrc
- 对css做兼容处理,查看兼容平台
caniuse 可以查看浏览器使用比例
webpack 默认会安装 browserslist ,当我们配置完browserslist的条件后，内部会请求符合条件的浏览器平台数据

常见配置 
>1%  市场占有率>%1
deault  市场占有率>%0.5 采用最新的两个版本
dead  废弃的
last 2 version 最新的两个版本

### package.json配置
```
  "browserslist":[
      ">1%",
      "last 2 version",
      "not dead"
   ],
```
### .browserslistrc文件配置
```
> 1%
last 2 version
not dead
```

## postcss
- css解析器
- 通过js转换css的工具
- 对css做兼容处理
- 做转化依赖于其他插件，如autoprefixer
postcss-cli命令行终端使用postcss
postcss 本身不做转换，依赖于其他插件进行转换处理，如autoprefixer
1. 安装  npm i postcss postcss-cli autoprefixer -D
使用  npx postcss --use autoprefixer  -o   ret.css   ./src/css/test.css
2. postcss-loader 使用
- 减化postcss操作
```
 {
                    test: /\.css$/,   
                    use: ["style-loader","css-loader",
                              {
                                        loader:"postcss-loader",
                                        options:{
                                             postcssOptions:{
                                                  plugins:[
                                                       require("autoprefixer"),
                                                       require("postcss-preset-env")
                                                  ]
                                                  //简写 postcss-preset-env中包含autoprefixer
                                                   plugins:[
                                                      'postcss-preset-env'
                                                  ]
                                             }
                                        }
                              }
                   ]
  }
```
上述方式如果对less文件处理也要写一份同样的配置，为了代码简洁，可以配置postcss.config.js进行插件配置
```
module.exports = {
     plugins:[
         require('postcss-preset-env')
     ]
}
```
这样配置后，webpack.config.js中对postcss配置就可以简写如下
``` 
                {
                    test: /\.css$/,  
                    use: ["style-loader","css-loader","postcss-loader"]
               },
               {
                    test: /\.less$/,   
                    use: [
                         'style-loader',
                         'css-loader',
                         'postcss-loader',
                         'less-loader'
                    ]
               }
```
- postcss-preset-env
1. postcss(插件) => autoprefixer(预设) => postcss-preset-env(插件集合)
- 对css属性如 color:#12345678 转换为rgba形式

##  importLoaders
- login.css @import 导入test.css
- login.css匹配到，使用postcss-loader处理
分析后发现并不需要额外处理，交给css-loader
但test.css里面确实有需要转化的语法
css-loader处理 @import后，拿到了test.css文件，但此时loader不会回头找该文件
最终将处理完的css代码都交给style-loader在界面显示
解决方案：
```
 use: [
                         "style-loader",
                         {
                              loader:"css-loader",
                              options:{
                                    importLoaders:1 //css loader工作中又找到了css,往前找一个loader进行处理
                              }
                         },
                         "postcss-loader"
]
```

 
## file-loader
- 对文件进行处理
```
  {
                    test: /\.(png|jpe?g|gif|svg)$/,   
                    use: [
                         'file-loader'
                    ]
  }
```
```
     //不想使用default也可以采用esModule引入的方式 import img from '../images/1.png'
     img.src = require('../images/1.png').default
     div.appendChild(img)
```
```
          {
                    test: /\.(png|jpe?g|gif|svg)$/,   
                    use: [
                         {
                              loader:'file-loader',
                              options:{
                                   esModule:false  //不转为esModule，文件require引入就不用使用.default
                              }
                         }
                    ]
               }
```
- 对于css中的背景图，css-loader会自动替换为require语法
background: url('../images/1.png');
=>
module.exports = __webpack_public_path__ + "c5e8d3ccd00560a61f9863dbb3d73eb2.png";
需要设置css-loader 
```
 options:{
      esModule:false  
 }
```

- file-loader打包结果进行处理
- outputPath设置输出目录
- name设置输出文件名
  1. [ext]  扩展名
  2. [name] 原样输出
  3. [hash] 文件内容hash 
  name可以写成路径形式，就可以省略outputPath
```
   options:{
                                   outputPath:"img", //打包输出目录
                                   name:"[name].[hash:6].[ext]",
                                   //简写
                                   name:"img/[name].[hash:6].[ext]",
                                   /*文件输出名 
                                     *[ext]: 扩展名
                                     *[name] 原样输出
                                     *[hash] :文件内容hash 
                                     *[contentHash]
                                   */
   }
```

## url-loader处理图片
- 和file-loader类型
file-loader拷贝文件到输出目录,会返回文件的路径 分开请求
url-loader把图片资源以base64形式加载到代码中  减少请求次数，适合小图  
url-loader内部也可以调用file-loader，通过limit属性控制，比limit大用file-loder进行拷贝，小进行url-loader base64转化
```
  {
                              loader:'url-loader',
                              options:{
                                   limit:"30*1024",
                                   name:"img/[name].[hash:6].[ext]",
                                   esModule:false  //不转为esModule，文件require引入就不用使用.default
                              }
   }
```

## assets 模块

- asset/resource -> file-loader
- asset/inline -> url-loader
- asset/source -> raw-loader
```
     output:{
          assetModuleFilename:"img/[name].[hash:6][ext]"  //设置asset的输出路径和文件名格式,全局方式
     },
     modlue中配置 作用类型file-loader
      {
                    test: /\.(png|jpe?g|gif|svg)$/,   
                    type:"asset/resource",
                    generator:{ //局部方式
                         filename:"img/[name].[hash:6][ext]"
                    }
      }
      //作用类似url-loader
      {
                    test: /\.(png|jpe?g|gif|svg)$/,   
                    type:"asset/inline",
                   
        }
        //类似url-loader 配置limit
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
        }
```
### asset处理字体

```
               {
                    test: /\.(ttf|woff2?)$/,   
                    type:"asset/resource",  //实现静态文件拷贝输出
                    generator:{
                         filename:"font/[name].[hash:6][ext]"
                    },
                }
```

## 插件
 loader 对特定文件类型进行转换 ，一个loader是一个函数
 plugin 可以在webpack工作任意实际做一些事情，贯穿webpack整个生命周期,一个插件就是一个类
  
1. clean-webpack-plugin  清除打包后的目录
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
plugins:[
         new CleanWebpackPlugin()
]
2. html-webpack-plugin 自动生成html，引入打包后的资源
 const {DefinePlugin} = require('webpack')  //定义全局常量
 const htmlWebackPlugin = require('html-webpack-plugin')
 plugins:[
         new htmlWebackPlugin({
              title:"首页",
              template:'./public/index.html'
         }),
         new DefinePlugin({
              BASE_URL:'"./"'
         })
 ]

template自定义html模板
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="<%= BASE_URL %>favicon.ico">
    <title>
        <%= htmlWebpackPlugin.options.title %>
    </title>
</head>
<body>
    <div id="app">测试</div>
</body>
</html>
```
3. copy-webpack-plugin  
- 实现资源拷贝，如public文件夹内容,globOptions用来忽略文件
```
const copyWebpackPlugin = require('copy-webpack-plugin')
 plugins:[
         new  copyWebpackPlugin({
              patterns:[
                   {
                        from:"public",
                        globOptions:{
                             ignore:['**/index.html']
                        }
                   }
              ]
         })
 ]
```
## babel
- jsx ts es6+ -> 产出浏览器能使用的模块，处理js兼容
- 本身不具备功能转换 需要安装对于的babel插件进行转换，ex:@babel/plugin-transform-arrow-functions 箭头函数转换
npm i @babel/core @babel/cli @babel/plugin-transform-arrow-functions  -D
- 命令行使用 
npx babel src/index.js  --out-dir  build  --plugins=@babel/plugin-transform-arrow-functions

- 预设(集合，涵盖es6+语法)
@babel/preset-env

npx babel src/index.js  --out-dir  build  --presets=@babel/preset-env 

## babel-loader
- npm i babel-loader  @babel/preset-env
- 默认基于browserslist配置规则进行平台的兼容处理
- 也可以通过presets配置进行配置兼容的平台
- 还可以基于配置文件中，有两种1.babel.config.js(json cjs mjs)(babel 7之后)  2.babelrc.json(babel 7之前)
babel.config.js
```
module.exports = {
    presets:['@babel/preset-env']
}
```
```
  {
                    test: /\.js$/,   
                    use:[
                         {
                              loader:"babel-loader",
                              options:{
                                  presets:[
                                       ['@babel/preset-env',{
                                             targets:"chrome 91"
                                        }
                                      ]
                               ]
                              }
                         }
                    ]
}
```

```

```

## polyfill配置
- promise symbol等语法@babel/preset-env无法转换 
  
npm i core-js(语法功能) regenerator-runtime(转换async await gengerate...)

module.exports = {
    presets:[
        ['@babel/preset-env',{
            //默认 false 不对当前js做polyfill填充  
            //usage 依据当前用户源代码中所使用的新语法进行填充
            //entry 依据所要兼容的浏览器（browserslist规则）来进行填充  entry需要导入核心包  import "core-js/stable"  import "regenerator-runtime/runtime"
            useBuiltIns: "usage",
            corejs:3
        }]
    ]
}

## webpack-dev-server
- 开发服务器
修改代码开发环境实时更新
1. package.json配置scripts开启监控
```
    "build": "webpack --watch",
```
2. webpack配置文件 添加watch
```
    watch:true,
```
但这两种方式也有不足
1. 修改某个文件，会重新打包所有的文件
2. 编译成功后都需要进行文件读写
3. live server
4. 无法实现热更新

上述可以通过webpack-dev-server解决
1. 安装 npm i webpack-dev-server
2. package.json配置打包命令 
- 默认去找webpack.conifg.js
如果配置文件不叫这个名字，需要指定配置
结果写入在内存中，不会生成dist文件
   "serve":"webpack serve --config xxx.webpack.js",
```
    "serve":"webpack serve",
```
## webpack-dev-middleware
- 可以把webpack处理完的内容返回给服务器
- 可以对打包结果做自由度的控制
- npm i webpack-dev-middleware -D

```
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
```


## HMR

1. webpack.config.js配置
```
     target:"web", //屏蔽browserslist,防止冲突hot失效
     devServer:{
          hot:true
     }
```
2. 在入口文件对需要开启hmr的文件判断
```

if(module.hot){
    module.hot.accept(['./js/login.js'],()=>{
         console.log('login 更新了')
    })
}

```

## React组件HMR
1. npm i  @babel/preset-react react-refresh  @pmmmwh/react-refresh-webpack-plugin -D
npm i react react-dom -S
2. babel.config.js 
```
presets:[
    ['@babel/preset-env'],
    ['@babel/preset-react']  //处理jsx语法
],
plugins:[
    ['react-refresh/babel']
]
```
3. webpack.config.js配置jsx解析规则
加载 @pmmmwh/react-refresh-webpack-plugin插件
```
{
     test:/\.jsx?$/,
     use:['babel-loader']
}
```
```
plugins:[new reactRefreshWebpackPlugin()]
```

## vue组件HMR
npm i vue@2.6.14 -S
npm i vue-template-compiler@2.6.14  vue-loader@14 -D
1. 配置vue文件规则
```
  {
                    test: /\.vue?$/,   
                    use:["vue-loader"]
}
```

vue-loader 15版本需要手动导入 const loader = require('vue-loader/lib/plugin')
plugins中进行实例化


## output
publicPath:'',  // 域名 + publicPath + filename 进行资源查找
output:{
          filename:"js/build.js",
          path:path.resolve(__dirname,'./dist'),
          publicPath:'',  // 域名 + publicPath + filename 进行资源查找
          assetModuleFilename:"img/[name].[hash:6][ext]"
 },

## devServer 
 告诉本地服务所在目录
  devServer:{
          hot:true,
          publicPath:'/'   默认值为/ 代表当前项目所在的目录 需要和output中的publicPath保持一致
          contentBase:"",//打包后的资源依赖其他资源（没有被webpack打包），告诉它去哪找，绝对路径
          watchContentBase:true //contentBase资源变化重新打包资源
 },
- 其他常用属性配置
1. hotOnly:true 启用热模块替换功能，在构建失败时不刷新页面作为回退
2. port:8080
3. open:true 
4. compress:true //开启gzip压缩
5. historyApiFallback: true //解决单页路由history刷新404问题


## proxy代理
```
 devServer:{
       proxy:{
            "/api":{
                 target:"http://bb.xx.com",  // /api开头的服务被转发的地址
                 pathRewrite:{"^/api":""}, //路径重写
                 changeOrigin:true //修改请求host地址  网页host看不到，发出去的host依据修改
            } 
       }
 }
```

## resolve
- 配置模块解析
- 对于直接引入的模块，默认去resolve的modules中去查找，默认是node_modules
- 对于文件没有确定后缀名，webpack会根据 resolve的extensions的扩展名依次查找
 resolve:{
          extensions:['.js','.json','.vue','.jsx'],
          alias:{
               "@":path.resolve(__dirname,'src')
          }
}
- 对于文件夹，没有后续文件路径，会去resolve的mainFiles中去找，默认是index
- alias配置路径别名，简化路径书写

## source-map
- 真实编译代码和源代码有差异，为了方法调试代码，可以开启source-map，依据转换后的代码与源码的映射
devtool: 'source-map'
1. eval 会将souce-map信息保存在源码中
2. source-map
3. eval-souce-map  base64形式把map信息放入到代码中
4. inline-source-map  
5. cheap-source-map 报错只提供行信息
6. cheap-module-source-map 报错只提供行信息
7. hidden-source-map 
8. nosources-source-map 生成map文件，错误提示找不到源文件

## ts-loader
1. npm i typescript -g 
2. tsc --init 初始化ts配置
tsc ./src/index.ts 编译ts
3. 利用loader打包 安装ts-loader  npm i ts-loader

 {
                    test: /\.ts$/,   
                    use:["ts-loader"]
},


## babel-loader处理ts文件
- ts-loader只能进行ts语法转换
- 需要对ts文件的兼容(es6+)处理
- @babel/preset-typescript预设，处理ts中的语法

babael.config.js设置
```
 module.exports = {
    presets:[
        ['@babel/preset-env',{
            //默认 false 不对当前js做polyfill填充
            useBuiltIns: "usage",
            corejs:3
        }],
        ['@babel/preset-react'], //处理jsx
        ['@babel/preset-typescript']
    ],
    plugins:[
        ['react-refresh/babel']
    ]
} 
```

package.json配置ts编译命令  tsc --noEmit,为了解决babel-loader无法识别ts语法错误
本地编译可以先运行ts编译在运行打包命令，完成先校验语法后打包的过程
build:"npm run jy&&webpack"
"jy":"tsc --noEmit"


## 区分打包环境
webpack配置文件导出一个函数,参数中可以获取打包命令传递的参数
"build": "webpack --config ./config/webpack.common.js --env production",
```
module.exports = (env) => {
     const isProduction = env.prodcution
     return {
          
     }
}
```

## 合并不同环境配置文件
- webpack-merge

const devConfig = require('./webpack-dev.js')
const prodConfig = require('./webpack-prod.js')
module.exports = (env) => {
     const isProduction = env.production
     //依据打包模式合并配置
     const config = isProduction? prodConfig:devConfig
     const mergeConfig = merge(commonConfig,config)
     return mergeConfig
}

babel.config.js配置
需要在webpack.common.js中设置环境变量
 process.env.NODE_ENV = isProduction ?'production':"development" 
```
const presets = [
    ['@babel/preset-env',{
        //默认 false 不对当前js做polyfill填充
        useBuiltIns: "usage",
        corejs:3
    }],
    ['@babel/preset-react'], //处理jsx
    ['@babel/preset-typescript']
]
const plugins = []
if(process.env.NODE_ENV==='development'){
    plugins.push(['react-refresh/babel'])
}
module.exports = {
    presets,
    plugins
}


```


## 代码拆分性能优化
1. 配置多入口打包
 entry:{
          main1:"./src/main1.js",
          main2:"./src/main2.js",
 },
 output:{
          filename:"js/[name].build.js", //多入口打包
          path:resolveApp('./dist'),
          //publicPath:'/',  // 域名 + publicPath + filename 进行资源查找
          assetModuleFilename:"img/[name].[hash:6][ext]"
 }
 //出去引入第三方的产生的license文件
const TerserPlugin = require('terser-webpack-plugin');
optimization: {
          minimizer: [new TerserPlugin({
               extractComments: false
          })],
},

ex: 多个html对于多个入口文件实例，通过new 多个 htmlWebackPlugin进行bundle的加载引入
```

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
```




2. 可以通过entry的dependOn属性进行第三方资源的分包加载，第三方资源单独打成一个包
main1:{
               import:"./src/main1.js",
               dependOn:"lodash"
},
ain1:{
               import:"./src/main2.js",
               dependOn:"lodash"
},
 lodash:"lodash"
 
 
 main1和main2共同依赖多个资源，可以有如下写法'lodash','jquery'单独打成一个包
 main1:{
               import:"./src/main1.js",
               dependOn:"shared"
 },
 main2:{
               import:"./src/main2.js",
               dependOn:"shared"
 },
 shared:['lodash','jquery']

 3. splitChunks拆包
 - chunks 默认值为async(异步)  initial(同步) all(都处理)
 - minSize: 一个包拆出来大小小于这个值，就不会被拆出来 默认200000 (20kb左右)
 - maxSize: 包的体积大于maxSize进行拆分
 - minChunks: 包被拆分要至少被引用一次 和minSize maxSize会相互影响，minSize maxSize优先级高
 - cacheGroups: 对拆分的包进行分组，分组后按照规则进行合并 
optimization: {
          splitChunks:{
               chunks: 'all',
               minSize:20000,
               minChunks:1,
               cacheGroups:{
                   syVendors:{
                         test:/[\\/]node_modules[\\/]/,
                         filename:"js/[id]_vendor.js",
                         priority:-10,//设置优先级，值越大优先级越高
                   }，
                   default:[ //某个模块被引入指定次数进行拆包
                        minChunks:2,
                        filename:"js/syy_[id].js",
                         priority:-20,

                   ]
               }
          }
}
4. 动态导入
 - import('')
 - webpack默认会单独打成一个文件
 对于生成的文件名可以配置optimization的chunkIds
 optimization:{
       chunkIds:"natural" //按照数字顺序生成 1 2 3... 当某个文件不在被依赖，重新打包序号都会变，影响缓存
       // "named" //文件名和路径拼接
       // "deterministic" 短数字(hash)，不会变  默认
 }
 对于bundle名可以修改output的chunkFilename
 output:{
       chunkFilename:"js/chunk_[name]"
 }
 在动态导入地方使用魔法注释添加name
 import(/*webpackChunkName:"title"*/,'./title/')


 5. runtimeChunk
- 会将动态打包相关信息抽离一个包，记录require  import等模块如何加载解析
 - 当修改加载模块的内容，webpack会重新打包，生成的文件名会发生变化
 - 当开启runtimeChunk后，修改文件，生成的文件名不会变化，只会修改抽离的包的文件,有利于浏览器缓存
 optimization:{
       runtimeChunk:true
 }

6. 懒加载
- ex: 点击按钮，加载某个模块
```
btn.click(function(){
      import('./utils').then(res=>{
           consoel.log('...')
      })
})
```

7. prefetch与preload
https://zhuanlan.zhihu.com/p/273298222
1. link标签设置 prefetch <link rel="prefetch" href="static/img/ticket_bg.a5bb7c33.png">
设置了prefetch的资源会在浏览器空闲时进行加载
<link rel="preload" href="xxx" as="xx">
设计上使用了自定义字体。开发完成后我们发现，页面首次加载时文字会出现短暂的字体样式闪动
标签显式声明一个高优先级资源，强制浏览器提前请求资源，同时不阻塞文档正常onload
preload link必须设置as属性来声明资源的类型（font/image/style/script等)，否则浏览器可能无法正确加载资源
webpack中使用
plugins: [
  new PreloadWebpackPlugin({
    rel: 'preload'，
    as(entry) {  //资源类型
      if (/\.css$/.test(entry)) return 'style';
      if (/\.woff$/.test(entry)) return 'font';
      if (/\.png$/.test(entry)) return 'image';
      return 'script';
    },
    include: 'asyncChunks', // preload模块范围，还可取值'initial'|'allChunks'|'allAssets',
    fileBlacklist: [/\.svg/] // 资源黑名单
    fileWhitelist: [/\.script/] // 资源白名单
  })
]
从前文的介绍可知，preload的设计初衷是为了尽早加载首屏需要的关键资源，从而提升页面渲染性能。

目前浏览器基本上都具备预测解析能力，可以提前解析入口html中外链的资源，因此入口脚本文件、样式文件等不需要特意进行preload。

但是一些隐藏在CSS和JavaScript中的资源，如字体文件，本身是首屏关键资源，但当css文件解析之后才会被浏览器加载。这种场景适合使用preload进行声明，尽早进行资源加载，避免页面渲染延迟。

与preload不同，prefetch声明的是将来可能访问的资源，因此适合对异步加载的模块、可能跳转到的其他路由页面进行资源缓存；对于一些将来大概率会访问的资源，如上文案例中优惠券列表的背景图、常见的加载失败icon等，也较为适用
preload-webpack-plugin 
- 提前下载页面需要模块，等到需要用对应模块直接加载
prefetch(预获取)：将来某些导航下可能需要的资源
preload(预加载)：当前导航下可能需要资源
btn.click(function(){
      import('
      /*webpackChunkName:"utils"*/
      /*webpacPreFetch:true*/ 会在浏览器空闲时候进行加载可能会用到的资源，会提前加载
      /*webpacPreLoad:true*/ 当前导航下可能需要用的资源，会立即下载，父 chunk 加载时，以并行方式开始加载,此时会在点击后加载资源
      ./utils').then(res=>{
           consoel.log('...')
      })
})

8. 第三方扩展设置CDN
- 查找网络资源首先去最近的边缘节点查找，然后去父节点，在找相邻父节点，不断往上找，直到源节点
- 有cdn服务器，设置publicPath为cdn地址即可服务cdn上资源
- 第三方包 设置 externals属性
```
externals:{
     lodash:"_" //key为不希望打包的报名 value为对外暴露的全局变量值
}
html页面中通过script引入cdn链接

```

9. Dll库
- DllPlugin 把共同的模块不经常变动的模块做成一个动态链接库文件
- ex  vue react不用每个项目都打包，将它们做成一个dll库，每次像cdn一样去映入

01. 制作dll库
const path = require('path')
const webpack = require('webpack')
const terser = require('terser-webpack-plugin')
module.exports = {
    mode:"production",
    entry:{
        react:['react','react-dom']
    },
    output:{
        path:path.resolve(__dirname,'../dll'),
        filename:"dll_[name].js",
        library:"dll_[name]"
    },
    optimization: {
        minimizer: [new terser({
             extractComments: false
        })],
    },
    plugins:[
          new webpack.DllPlugin({
              name:"dll_[name]",
              path:path.resolve(__dirname,'../dll/[name].manifest.json')
          })
    ]
}

02. 引入dll库 
npm i add-asset-html-webpack-plugin -D
 plugins:[
         new webpack.DllReferencePlugin({
              manifest: resolveApp('./dll/react.manifest.json'),
              context:resolveApp('./')  //相对manifest如何找目标js
         }),
         new AddAssetHtmlPlugin({ 
              outputPath:"js",
              filepath:resolveApp('./dll/dll_react.js')
         }),
]

## css文件抽离压缩
npm i mini-css-extract-plugin -D
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
 new MiniCssExtractPlugin({
              filename:"[name].[ hash:8].css"
})
替换style-loader
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
 

## css压缩
- npm i css-minimizer-webpack-plugin -D
- const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

 optimization: {
     minimizer: [
       new CssMinimizerPlugin(),
     ],
}

## js压缩
- npm install terser-webpack-plugin -D
- 依赖于terser库
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
};

## scope hoisting
原理：将所有模块的代码按照引用顺序放在一个函数作用域里，然后适当的重命名一些变量以防止变量名冲突
对比：通过scope hoisting可以减少函数声明代码和内存开销
- production默认开启
 plugins: [
      // 开启 Scope Hoisting 功能
      new webpack.optimize.ModuleConcatenationPlugin()
  ]
       
## usedExports
    
   optimization: {
      usedExports:true,
      minimizer: [new TerserPlugin({
                    extractComments: false
     })],
     minimize:true
   }
   对于没有用到的代码会通过注释做标记 /*unused harmony ....*/
   通过TerserPlugin进行无用代码剔除

## sideEffects
webpack 去除 tree shaking 带来副作用的代码
package.json 设置sideEffects:false
- 指定模块副作用 指定模块不会参与tree shaking 
sideEffects:[
     './src/title.js'
]
- 对于css如果想使用副作用，可以在rules中配置sideEffects：true


## css tree shaking
- npm i purgecss-webpack-plugin glob -D

 new purgecssWebpackPlugin({
            paths:glob.sync(`${resolveApp("./src")}/**/*`,{nodir:true}),
            safelist:function(){
                 return {
                      standard:['body','html'] //保存html body
                 }
            }

 })

## 资源压缩
- devServer 配置 compress:true 开启gzip压缩，针对开发环境
- 生产环境 compression-webpack-plugin

 npm install compression-webpack-plugin --save-dev

 const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  plugins: [new CompressionPlugin({
       test:/\.(css|js)$/, //指定文件类型进行压缩
       minRatio:0.8 //压缩比例
  })],
};


## inlineChunkHtmlPlugin
- runtime js内联嵌入html中
npm i  inline-chunk-html-plugin  -D
var InlineChunkHtmlPlugin = require('inline-chunk-html-plugin');
 new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime.*\.js/]),

 ## 打包库
 - output选项
 libraryTarget:"umd"
 library:"$" //全局访问变量
 globalObject:this

 ## 打包时间内容分析
 1. pm install --save-dev speed-measure-webpack-plugin  分析webpack各种配置打包时间
 

 const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");

const smp = new SpeedMeasurePlugin();

const webpackConfig = smp.wrap(webpack配置文件);

 2. npm install --save-dev webpack-bundle-analyzer
 webpack-bundle-analyzer 可视化分析打包后的资源

 const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
 new BundleAnalyzerPlugin()
