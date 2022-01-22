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



