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
    <view class="btn-settle">结算({{checkedCount}})</view>
  </view>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  export default {
    name: "my-settle",
    data() {
      return {

      };
    },
    computed: {
      ...mapGetters('m_cart', ['checkedCount', 'total', 'totalPrice']),
      isfullChecked() {
        return this.checkedCount === this.total
      }
    },
    methods: {
      ...mapMutations('m_cart', ['updateAllGoodsState']),
      changeAllState() {
        this.updateAllGoodsState(!this.isfullChecked)
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
