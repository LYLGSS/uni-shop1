import Vue from 'vue'
import Vuex from 'vuex'
// 1. 导入购物车的 vuex 模块
import moduleCart from './cart.js'
import moduleUser from './user.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    m_cart: moduleCart,
    m_user: moduleUser
  }
})
export default store
