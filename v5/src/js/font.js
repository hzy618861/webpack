import '../font/iconfont.css'
function Font(){
    const div = document.createElement('div')
    const span = document.createElement('span')
    span.className = 'iconfont icon-shouye lg-icon'
    div.appendChild(span)
    return div
}
document.body.appendChild(Font())
