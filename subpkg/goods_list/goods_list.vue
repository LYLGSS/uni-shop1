<template>
  <view>
    <view class="goods_list">
      <view v-for="(goods,i) in goodsList" :key="i" @click="gotoDetail(goods)">
        <my-goods :goods="goods"></my-goods>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        queryObj: {
          // 查询关键字
          query: '',
          // 商品分类 id
          cid: '',
          // 页码值
          pagenum: 1,
          // 每页展示多少条数据
          pagesize: 10
        },
        goodsList: [],
        total: 0,
        // 节流阀
        isloading: false
      };
    },
    onLoad(options) {
      this.queryObj.query = options.query || ''
      this.queryObj.cid = options.cid || ''
      this.getGoodsList()
    },
    methods: {
      // 获取商品列表数据
      async getGoodsList(cb) {
        // 打开节流阀
        this.isloading = true
        const { data: res } = await uni.$http.get("/api/public/v1/goods/search", this.queryObj)
        // 关闭节流阀
        this.isloading = false
        // 若有回调函数，则调用
        cb && cb()
        if (res.meta.status !== 200) return uni.showMsg()
        this.goodsList = [...this.goodsList, ...res.message.goods] //拼接之前的数据和新一页的数据
        this.total = res.message.total
      },
      // 跳转到商品详情页并传参
      gotoDetail(goods) {
        uni.navigateTo({
          url: `/subpkg/goods_detail/goods_detail?goods_id=${goods.goods_id}`
        })
      }
    },
    // 上拉触底事件的处理函数
    onReachBottom() {
      // 判断数据是否加载完毕
      if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕！')
      // 再次请求之前判断，若正在请求中，则返回
      if (this.isloading) return
      // 页码自增+1
      this.queryObj.pagenum++
      // 重新获取列表数据
      this.getGoodsList()
    },
    onPullDownRefresh() {
      // 重置关键数据
      this.queryObj.pagenum = 1
      this.total = 0
      this.isloading = false
      this.goodsList = []
      // 重新发起数据请求，并传入回调函数，关闭下拉刷新
      this.getGoodsList(() => uni.stopPullDownRefresh())
    }
  }
</script>

<style lang="scss">

</style>
