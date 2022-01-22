module.exports = {
    presets:[
        ['@babel/preset-env',{
            //默认 false 不对当前js做polyfill填充
            useBuiltIns: "usage",
            corejs:3
        }]
    ]
}