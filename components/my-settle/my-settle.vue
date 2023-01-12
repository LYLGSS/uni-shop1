<template>
  <view class="my-settle-container">
    <!-- 全选 -->
    <label class="radio">
      <radio color="#C00000" :checked="isfullChecked" @click="changeAllState" /><text>全选</text>
    </label>
    <!-- 合计 -->
    <view class="amount-box">
      合计：<text class="amount">￥{{totalPrice}}</text>
    </view>
    <!-- 结算按钮 -->
    <view class="btn-settle" @click="settlement">结算({{checkedCount}})</view>
  </view>
</template>

<script>
  import { mapGetters, mapMutations, mapState } from 'vuex'
  export default {
    name: "my-settle",
    data() {
      return {
        // 倒计时的秒数
        seconds: 3,
        // 定时器的id
        timer: null
      };
    },
    computed: {
      ...mapGetters('m_cart', ['checkedCount', 'total', 'totalPrice']),
      ...mapGetters('m_user', ['addressStr']),
      ...mapState('m_user', ['token']),
      ...mapState('m_cart', ['cart']),
      isfullChecked() {
        return this.checkedCount === this.total
      }
    },
    methods: {
      ...mapMutations('m_cart', ['updateAllGoodsState']),
      ...mapMutations('m_user', ['updateRedirectInfo']),
      changeAllState() {
        this.updateAllGoodsState(!this.isfullChecked)
      },
      // 点击结算按钮
      settlement() {
        // if (!this.token) return uni.$showMsg('请先登录！')
        if (!this.token) return this.delayNavigate()
        if (!this.checkedCount) return uni.$showMsg('请选择要结算的商品！')
        if (!this.addressStr) return uni.$showMsg('请选择收货地址！')
        // 微信支付
        this.payOrder()
      },
      // 展示倒计时的提示消息
      showTips(n) {
        uni.showToast({
          icon: 'none',
          title: '请登录后再结算！' + n + '秒后自动跳转到登录页',
          mask: true,
          duration: 1500
        })
      },
      // 延时导航到登录页面
      delayNavigate() {
        this.showTips(this.seconds)
        this.timer = setInterval(() => {
          this.seconds--
          if (this.seconds <= 0) {
            clearInterval(this.timer)
            uni.switchTab({
              url: '/pages/my/my',
              success: () => {
                this.updateRedirectInfo({
                  // 跳转方式
                  openType: 'switchTab',
                  // 从哪个页面跳转过去的
                  from: '/pages/cart/cart'
                })
              }
            })
            // 重置延迟时间为3，否则，不登录时，第二次点击结算按钮，将不再延时跳转
            return this.seconds = 3 //下边的showTips不再执行
          }
          this.showTips(this.seconds)
        }, 1000)
      },
      async payOrder() {
        // 1.创建订单
        // 1.1组织订单的信息对象
        const orderInfo = {
          // order_price: this.totalPrice,//开发时，订单价格写为0.01，测试用
          order_price: 0.01,
          consignee_addr: this.addressStr,
          goods: this.cart.filter(item => item.goods_state).map(item => ({
            goods_id: item.goods_id,
            goods_number: item.goods_number,
            goods_price: item.goods_price
          }))
        }
        // 1.2发起请求创建订单
        const { data: res } = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo)
        // if (res.meta.status !== 200) return uni.$showMsg('创建订单失败！')
        // 1.3得到服务器响应的“订单编号”
        // const orderNumber = res.message.order_number
        // 这里由于接口问题，作如下处理
        if (res.meta.msg === '无效token') {
          // 这里 const 和 let 都不能使用，这两个声明的内容都是局部的，if外部访问不到
          var orderNumber = 'GD20180504000000000045'
        }
        // 2.订单预支付
        // 2.1发起请求获取订单的支付信息
        const { data: res2 } = await uni.$http.post(
          '/api/public/v1/my/orders/req_unifiedorder', { order_number: orderNumber })
        // if (res2.meta.status !== 200) return uni.$showMsg('预付订单生成失败！')
        // 2.3得到订单支付相关的必要参数
        // const payInfo = res2.message.pay
        // 由于接口问题，这里直接写死
        const payInfo = {
          "timeStamp": String(Date.now()),
          "nonceStr": "BkPggorBXZwPGXe3",
          "package": "prepay_id=wx071619042918087bb4c1d3d72999385683",
          "signType": "MD5",
          "paySign": "D1642DEEF1663C8012EDEB9297E1D516"
        }
        // 3.发起微信支付
        // 3.1调用uni.requestPayment() 发起微信支付
        const [err, succ] = await uni.requestPayment(payInfo).catch(err => err)
        // 3.2未完成支付
        if (err) return uni.$showMsg('订单未支付！---接口问题')
        // 3.3完成了支付，进一步查询支付的结果
        const { data: res3 } = await uni.$http.post(
          '/api/public/v1/my/orders/chkOrder', { order_number: orderNumber })
        // 3.4检测到订单未支付
        if (res3.meta.status !== 200) return uni.$showMsg('订单未支付！')
        // 3.5检测到订到支付完成
        uni.showToast({
          title: '订单支付完成！',
          icon: 'success'
        })
      }
    }
  }
</script>

<style lang="scss">
  .my-settle-container {
    width: 100%;
    height: 50px;
    background-color: white;
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 5px;
    font-size: 14px;

    .radio {
      display: flex;
      align-items: center;
    }

    .amount-box {
      .amount {
        color: #C00000;
        font-weight: bold;
      }
    }

    .btn-settle {
      background-color: #C00000;
      color: white;
      line-height: 50px;
      min-width: 100px;
      text-align: center;
      padding: 0 10px;
    }
  }
</style>
