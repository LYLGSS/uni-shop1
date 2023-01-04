<template>
  <!-- 这里v-if是为了防止数据回来之前，商品价格和名称显示为undefined，干脆让数据回来之前，不显示页面结构 -->
  <view v-if="goods_info.goods_name" class="goods-detail-container">
    <!-- 轮播图区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(item,i) in goods_info.pics" :key="i">
        <image :src="item.pics_big" @click="preview(i)"></image>
      </swiper-item>
    </swiper>
    <!-- 商品信息区域 -->
    <view class="goods-info-box">
      <!-- 商品价格 -->
      <view class="price">￥{{goods_info.goods_price}}</view>
      <!-- 商品信息主体区域 -->
      <view class="goods_info-body">
        <view class="goods-name">{{goods_info.goods_name}}</view>
        <!-- 收藏 -->
        <view class="favi">
          <uni-icons type="star" size="18" color="gray"></uni-icons>
          <text>收藏</text>
        </view>
      </view>
      <!-- 运费 -->
      <view class="yf">快递：免运费</view>
    </view>
    <rich-text :nodes="goods_info.goods_introduce"></rich-text>
    <!-- 商品导航组件区域 -->
    <view class="goods_nav">
      <uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick"
        @buttonClick="buttonClick" />
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        goods_info: {},
        // 底部导航栏中左侧按钮的配置对象
        options: [{
          icon: 'shop',
          text: '店铺',
        }, {
          icon: 'cart',
          text: '购物车',
          info: 6
        }],
        // 右侧按钮的配置对象
        buttonGroup: [{
            text: '加入购物车',
            backgroundColor: '#ff0000',
            color: '#fff'
          },
          {
            text: '立即购买',
            backgroundColor: '#ffa200',
            color: '#fff'
          }
        ]
      };
    },
    methods: {
      async onLoad(options) {
        console.log(options);
        const goods_id = options.goods_id
        const { data: res } = await uni.$http.get("/api/public/v1/goods/detail", { goods_id })
        if (res.meta.status !== 200) return uni.showMsg()
        // 解决图片之间的空白间隙
        res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g, '<img style="display:block;"')
        this.goods_info = res.message
      },
      preview(i) {
        // 预览图片
        uni.previewImage({
          // 预览时，默认显示图片的索引
          current: i,
          // 所有图片url地址的数组
          urls: this.goods_info.pics.map(item => item.pics_big)
        })
      },
      onClick(e) {
        if (e.content.text === "购物车") {
          uni.switchTab({
            url: "/pages/cart/cart"
          })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .goods-detail-container {
    padding-bottom: 50px;

    swiper {
      height: 750rpx;

      image {
        width: 100%;
        height: 100%;
      }
    }

    .goods-info-box {
      padding: 10px 0px 10px 10px;

      .price {
        color: #c00000;
        font-size: 18px;
        margin: 10px 0;
      }

      .goods_info-body {
        display: flex;

        .goods-name {
          font-size: 13px;
          margin-right: 10px;
        }

        .favi {
          width: 120px;
          font-size: 12px;
          color: gray;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-left: 1px solid #efefef
        }
      }

      .yf {
        font-size: 12px;
        color: gray;
        margin: 10px 0;
      }
    }

    .goods_nav {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
    }
  }
</style>
