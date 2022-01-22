import '../css/login.css'
import '../css/login.less'
// import '../css/test.css'
function login(){
     const h2 = document.createElement('h2')
     h2.innerHTML = '黄总牛逼'
     h2.className = 'hzy'
     return h2
}
document.body.appendChild(login())