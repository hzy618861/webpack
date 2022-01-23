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