// import {sum,square} from './js/util.js'
import login from './js/login'
// import './js/image'
// import './js/font'
// const ajax = require('./js/api')
// console.log(sum(3,2))
// console.log(square(3))
// console.log(ajax())
import React from 'react'
import ReactDom from 'react-dom'
// import App from './react/index.jsx'
import App from '@/vue/index'
import Vue from 'vue'

const a = '1'
if(module.hot){
    module.hot.accept(['./js/login.js'],()=>{
         console.log('login 更新了')
    })
}
new Vue({
    render(h){
         return h(App)
    }
}).$mount('#app')
// ReactDom.render(<App/>,document.getElementById('app'))
