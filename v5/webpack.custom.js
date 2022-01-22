const path = require('path')
module.exports = {
     entry:"./src/index.js",
     output:{
          filename:"build-custom.js",
          path:path.resolve(__dirname,'./dist')
     }
}