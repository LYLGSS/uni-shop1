<template>
  <view class="goods_item">
    <!-- 左边的盒子 -->
    <view class="goods-item-left">
      <radio :checked="goods.goods_state" color="#C00000" v-if="showRadio" @click="radioChangeHanlder"></radio>
      <image :src="goods.goods_small_logo || defaultPic" mode="" class="goods-pic"></image>
    </view>
    <!-- 右边的盒子 -->
    <view class="goods-item-right">
      <!-- 商品的名字 -->
      <view class="goods-name">{{goods.goods_name}}</view>
      <view class="goods-info-box">
        <view class="goods-price">￥{{goods.goods_price | tofixed}}</view>
        <uni-number-box :min="1" :value="goods.goods_count" v-if="showNum" @change="numChangeHanlder"
          @blur="blur($event,goods.goods_id)">
        </uni-number-box>
      </view>
    </view>
  </view>
</template>

<script>
  import { mapMutations } from 'vuex'
  export default {
    name: "my-goods",
    props: {
      goods: {
        type: Object,
        default: {}
      },
      showRadio: {
        type: Boolean,
        // 默认情况不展示radio组件
        default: false
      },
      showNum: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        // 默认的空图片
        defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
      };
    },
    // 过滤器
    filters: {
      // 把数字处理为带两位小数点的数字
      tofixed(num) {
        return Number(num).toFixed(2)
      }
    },
    methods: {
      // radio 组件的点击事件处理函数
      radioChangeHanlder() {
        this.$emit('radio-change', {
          goods_id: this.goods.goods_id,
          goods_state: !this.goods.goods_state
        })
      },
      // uni-num-box 组件值变化的处理函数
      numChangeHanlder(val) {
        this.$emit('numChange', {
          goods_id: this.goods.goods_id,
          goods_count: +val //为了保证val是Number类型(也可以为 val-0 或 Number(val))
        })
      },
      ...mapMutations('m_cart', ['resetGoodsCount']),
      blur(e, goods_id) {
        // 输入框失去焦点时，获取输入框中的内容
        const tmp_val = parseInt(e.detail.value)
        // 如果是 tmp_val 是 NaN ，则将商品数量赋值为1（此处是为了防止在数字前输入字母时，输入框中的内容变为1，但此商品的数量并没有重置为1）
        if (!tmp_val) {
          this.resetGoodsCount(goods_id)
        }

      }
    }

  }
</script>

<style lang="scss" scoped>
  .goods_item {
    display: flex;
    padding: 10px 5px;
    border-bottom: 1px solid #f0f0f0;

    .goods-item-left {
      margin-right: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .goods-pic {
        width: 100px;
        height: 100px;
        display: block; //解决图片之间的空隙
      }
    }

    .goods-item-right {
      display: flex;
      flex-grow: 1; //占满父容器
      flex-direction: column;
      justify-content: space-between;

      .goods-name {
        font-size: 13px;
      }

      .goods-info-box {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .goods-price {
          font-size: 16px;
          color: #C00000;
        }
      }
    }
  }
</style>
