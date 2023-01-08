<template>
  <view>
    <!-- my-search组件 -->
    <view class="search-box">
      <my-search @click.native="gotoSearch"></my-search>
    </view>
    <!-- 轮播图 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(item,index) in swiperList" :key="item.goods_id">
        <!-- 点击图片进行跳转并携带参数（商品id） -->
        <navigator class="swiper-item" :url="`/subpkg/goods_detail/goods_detail?goods_id=${item.goods_id}`">
          <image :src="item.image_src" mode=""></image>
        </navigator>
      </swiper-item>
    </swiper>
    <!-- 分类导航 -->
    <view class="nav-list">
      <view class="nav-item" v-for="(item,index) in navList" :key="item.name">
        <image :src="item.image_src" mode="" class="nav-img" @click="navClickHandler(item)"></image>
      </view>
    </view>
    <!-- 楼层 -->
    <!-- 楼层的容器 -->
    <view class="floor-list">
      <!-- 每一个楼层的item项 -->
      <view class="floor-item" v-for="(item,index) in floorList" :key="item.floor_title.name">
        <!-- 楼层的标题 -->
        <image :src="item.floor_title.image_src" mode="" class="floor-title"></image>
        <!-- 楼层的图片区域 -->
        <view class="floor-img-box">
          <!-- 左侧大图片的盒子 -->
          <navigator class="left-img-box" :url="item.product_list[0].url">
            <image :src="item.product_list[0].image_src" :style="{width:item.product_list[0].image_width+'rpx'}"
              mode="widthFix">
            </image>
          </navigator>
          <!-- 右侧4个小图片的盒子 -->
          <view class="right-img-box">
            <navigator :url="item2.url" class="right-img-item"
              v-for="(item2,index2) in item.product_list.filter((item3,index3)=>index3!==0)">
              <image :src="item2.image_src" :style="{width:item2.image_width+'rpx'}" mode="widthFix"></image>
            </navigator>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import { $http } from '@escook/request-miniprogram';
  import badgeMix from '@/mixins/tabbar-badge.js'
  export default {
    mixins: [badgeMix],
    data() {
      return {
        // 轮播图的数据
        swiperList: [],
        // 分类导航的数据
        navList: [],
        // 楼层的数据
        floorList: []
      };
    },
    onLoad() {
      // 获取轮播图的数据
      this.getSwiperList()
      // 获取分类导航的数据
      this.getNavList()
      // 获取楼层的数据
      this.getFloorList()
    },
    methods: {
      // 获取轮播图的数据
      async getSwiperList() {
        const { data: res } = await uni.$http.get("/api/public/v1/home/swiperdata")
        // 请求失败
        if (res.meta.status !== 200) return uni.$showMsg()
        // 请求成功，转存数据
        this.swiperList = res.message
      },
      // 获取分类导航的数据
      async getNavList() {
        const { data: res } = await uni.$http.get("/api/public/v1/home/catitems")
        if (res.meta.status !== 200) return uni.$showMsg()
        this.navList = res.message
      },
      // nav-item 被点击时的处理函数
      navClickHandler(item) {
        if (item.name === "分类") {
          uni.switchTab({
            url: "/pages/cate/cate"
          })
        }
      },
      // 获取首页楼层的数据
      async getFloorList() {
        const { data: res } = await uni.$http.get("/api/public/v1/home/floordata")
        if (res.meta.status !== 200) return uni.$showMsg()
        // 处理数据
        res.message.forEach(floor => {
          floor.product_list.forEach(product => {
            product.url = "/subpkg/goods_list/goods_list?" + product.navigator_url.split("?")[1]
          })
        })
        this.floorList = res.message
      },
      gotoSearch() {
        uni.navigateTo({
          url: "/subpkg/search/search"
        })
      }
    }
  }
</script>
<style lang="scss">
  .search-box {
    // 吸顶定位
    position: sticky;
    // 吸顶的位置
    top: 0;
    // 提高层级，防止被轮播图覆盖
    z-index: 999;
  }

  swiper {
    height: 330rpx;

    .swiper-item,
    image {
      width: 100%;
      height: 100%;
    }
  }

  .nav-list {
    display: flex;
    justify-content: space-around;
    margin: 15px 0;

    .nav-img {
      width: 128rpx;
      height: 140rpx;
    }
  }

  .floor-title {
    width: 100%;
    height: 60rpx;
  }

  .right-img-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }

  .floor-img-box {
    display: flex;
    padding-left: 14rpx;
  }
</style>
