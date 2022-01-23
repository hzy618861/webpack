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

