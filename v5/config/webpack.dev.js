
const reactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
module.exports =  {
     mode:"development",
     devtool:"cheap-source-map",
     target:"web", //屏蔽browserslist,防止冲突
     devServer:{
          hot:true
     },
     plugins:[
         new reactRefreshWebpackPlugin()
     ]
 
  }