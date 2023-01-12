import App from './App'
import Vue from 'vue'
import store from '@/store/store.js'

// 按需导入 $http 对象
import { $http } from '@escook/request-miniprogram'

Vue.config.productionTip = false

// 在 uni-app 项目中，可以把 $http 挂载到 uni 顶级对象之上，方便全局调用
uni.$http = $http
// 配置请求根路径
// $http.baseUrl = 'https://www.uinav.com'
// $http.baseUrl = 'https://api-ugo-web.itheima.net'
$http.baseUrl = 'https://api-hmugo-web.itheima.net'

// 请求拦截器
$http.beforeRequest = function(options) {
  uni.showLoading({
    title: "数据加载中..."
  })
  // 判断当前请求的是否为有权限的接口
  if (options.url.indexOf('/my/') !== -1) {
    // 是的话在请求头中添加 Authorization 字段（ 登录时服务器返回的 token, 用于身份认证）
    options.header = {
      'Authorization': store.state.m_user.token
    }
  }
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
