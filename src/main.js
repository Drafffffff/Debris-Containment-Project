import './style.css';
import 'bulma/css/bulma.min.css'
import Vue from 'vue'
import app from './App.vue'
import InfiniteLoading from 'vue-infinite-loading';
require('vue2-animate/dist/vue2-animate.min.css')

Vue.use(InfiniteLoading);


Vue.filter('dateFormat', function (date) {
    let ct = new Date()
    let pt = new Date(date);
    let dt = ct.getTime() - pt.getTime()
    let y = pt.getFullYear();
    let m = (pt.getMonth() + 1).toString();
    let d = pt.getDate();
    let h = pt.getHours();
    let min = pt.getMinutes().toString().padStart(2, "0");
    //计算出相差天数
    let days = Math.floor(dt / (24 * 3600 * 1000))
    //计算出小时数
    let leave1 = dt % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
    let hours = Math.floor(leave1 / (3600 * 1000))
    //计算相差分钟数
    let leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
    let minutes = Math.floor(leave2 / (60 * 1000))
    //计算相差秒数
    let leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
    let seconds = Math.round(leave3 / 1000)
    if (d === ct.getDate()) {
        if (seconds == 0) {
            return "刚刚"
        } else if (hours < 1 && minutes < 1) {
            return `${seconds} 秒前`
        } else if (hours < 1 && minutes >= 1) {
            return `${minutes} 分钟前`
        } else {
            return `今天 ${h}:${min}`
        }
    } else {
        if (y === ct.getFullYear()) {
            return `${m}月${d}日 ${h}:${min}`
        } else {
            return `${y}年${m}月${d}日 `
        }
    }

})

new Vue({
    el: '#app',
    render: h => h(app),
})