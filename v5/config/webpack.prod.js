const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const copyWebpackPlugin = require('copy-webpack-plugin')
module.exports = {
    mode:"production",
    plugins:[
        new CleanWebpackPlugin(),
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

 }