const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const copyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const purgecssWebpackPlugin = require("purgecss-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const resolveApp = require("./paths");
const glob = require('glob');
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
        }),
        new MiniCssExtractPlugin({
          filename:"css/[name].[hash:8].css"
       }),
       new purgecssWebpackPlugin({
            paths:glob.sync(`${resolveApp("./src")}/**/*`,{nodir:true})
       }),
       new BundleAnalyzerPlugin()
    ],
    optimization: {
     minimizer: [
       new CssMinimizerPlugin(),
     ],
     usedExports:true
   },

 }