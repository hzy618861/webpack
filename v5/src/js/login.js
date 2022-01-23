import '../css/login.css'
import '../css/login.less'
import _ from 'lodash'
// import '../css/test.css'
function login(){
     const h2 = document.createElement('h2')
     h2.innerHTML = '黄总牛逼122111'
     h2.className = 'hzy'
     return h2
}
console.log(_)
document.body.appendChild(login())
