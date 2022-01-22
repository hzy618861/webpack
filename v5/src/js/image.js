function Image(){
     const div = document.createElement('div')
     const img = document.createElement('img')
     img.src = require('../images/1.png')
     const box = document.createElement('div')
     box.className = 'box' //css设置背景图
     div.appendChild(box)
     div.appendChild(img)
     return div
}
document.body.appendChild(Image())