import App from './App'
import Vue from 'vue'
import store from '@/store/store.js'

// 按需导入 $http 对象
import { $http } from '@escook/request-miniprogram'

Vue.config.productionTip = false

// 在 uni-app 项目中，可以把 $http 挂载到 uni 顶级对象之上，方便全局调用
uni.$http = $http
// 配置请求根路径
$http.baseUrl = 'https://www.uinav.com'

// 请求拦截器
$http.beforeRequest = function(options) {
  uni.showLoading({
    title: "数据加载中..."
  })
}
// 响应拦截器
$http.afterRequest = function() {
  uni.hideLoading()
}

// 封装弹框的方法
uni.$showMsg = function(title = "数据请求失败！", duration = 1500) {
  uni.showToast({
    title,
    duration,
    icon: "none"
  })
}

App.mpType = 'app'
const app = new Vue({
  ...App,
  store
})
app.$mount()
