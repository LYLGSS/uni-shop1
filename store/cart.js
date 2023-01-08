export default {
  // 为当前模块开启命名空间
  namespaced: true,

  // 模块的 state 数据
  state: () => ({
    // 购物车的数组，用来存储购物车中每个商品的信息对象
    // 每个商品的信息对象，都包含如下 6 个属性：
    // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
    cart: JSON.parse(uni.getStorageSync('cart') || '[]'),
  }),

  // 模块的 mutations 方法
  mutations: {
    addToCart(state, goods) {
      const findResult = state.cart.find(item => item.goods_id === goods.goods_id)
      if (!findResult) {
        // 购物车中没有此商品，则添加该商品到购物车
        state.cart.push(goods)
      } else {
        // 购物车中有此商品，则数量+1（注意，这里的 findResult 为满足条件的商品对象引用地址）
        findResult.goods_count++
      }
      this.commit('m_cart/saveToStorage')
    },
    // 将购物车的数组保存到本地
    saveToStorage(state) {
      uni.setStorageSync('cart', JSON.stringify(state.cart))
    },
    // 更新购车车中商品的勾选状态
    updateGoodsState(state, goods) {
      const findResult = state.cart.find(item => item.goods_id === goods.goods_id)
      if (findResult) {
        findResult.goods_state = goods.goods_state
        this.commit('m_cart/saveToStorage')
      }
    },
    // 更新商品的数量
    updateGoodsCount(state, goods) {
      const findResult = state.cart.find(item => item.goods_id === goods.goods_id)
      if (findResult) {
        findResult.goods_count = goods.goods_count
        this.commit('m_cart/saveToStorage')
      }
    },
    // 重置商品的数量为1
    resetGoodsCount(state, goods_id) {
      const findResult = state.cart.find(item => item.goods_id === goods_id)
      if (findResult) {
        findResult.goods_count = 1
        this.commit('m_cart/saveToStorage')
      }
    },
    // 根据id删除商品
    removeGoodsById(state, goods_id) {
      state.cart = state.cart.filter(item => item.goods_id !== goods_id)
      this.commit('m_cart/saveToStorage')
    },
    updateAllGoodsState(state, newState) {
      state.cart.forEach(item => item.goods_state = newState)
      this.commit('m_cart/saveToStorage')
    }
  },

  // 模块的 getters 属性
  getters: {
    // 计算购物车中商品总数量
    total(state) {
      return state.cart.reduce((all, curentValue) => all + curentValue.goods_count, 0)
    },
    // 计算勾选商品的总数量
    checkedCount(state) {
      return state.cart.filter(item => item.goods_state).reduce((all, curentValue) => all + curentValue.goods_count, 0)
    },
    // 计算勾选商品的总价格
    totalPrice(state) {
      return state.cart
        .filter(item => item.goods_state)
        .reduce((all, currentValue) => all + currentValue.goods_count * currentValue.goods_price, 0)
        .toFixed(2)
    }
  },
}
