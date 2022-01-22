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

