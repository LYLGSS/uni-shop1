import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('m_cart', ['total'])
  },
  onShow() {
    this.setBadge()
  },
  methods: {
    // 设置数字徽标
    setBadge() {
      // 如果购物车中商品总数为0，则不设置数字徽标
      if (parseInt(this.total) === 0) return uni.removeTabBarBadge({
        index: 2
      })
      uni.setTabBarBadge({
        index: 2,
        text: this.total.toString() // text的值必须为String类型
      })
    }
  },
  watch: {
    total() {
      this.setBadge()
    }
  }
}
