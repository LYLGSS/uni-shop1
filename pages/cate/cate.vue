<template>
  <view class="scroll-view-container">
    <!-- 左侧滑动区域 -->
    <scroll-view class="left-scroll-view" scroll-y="true" :style="{height: wh+'px'}">
      <block v-for="(item,index) in cateList" :key="item.cat_id">
        <view :class="['left-scroll-view-item',index===active?'active':'']" @click="activeChanged(index)">
          {{item.cat_name}}
        </view>
      </block>
    </scroll-view>
    <!-- 右侧滑动区域 -->
    <scroll-view scroll-y="true" :style="{height: wh+'px'}" :scroll-top="scrollTop">
      <view class="cate-lv2" v-for="item2 in cateLevel2" :key="item2.cat_id">
        <view class="cate-lv2-title">/ {{item2.cat_name}} /</view>
        <!-- 三级分类列表容器 -->
        <view class="cate-lv3-list">
          <view class="cate-lv3-item" v-for="item3 in item2.children" :key="item3.cat_id" @click="gotoGoodsList(item3)">
            <!-- 三级分类的图片 -->
            <image :src="item3.cat_icon.replace('dev','web')" mode=""></image>
            <!-- 三级分类的文本 -->
            <text>{{item3.cat_name}}</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>

</template>

<script>
  export default {
    data() {
      return {
        // 当前设备可用的高度
        wh: 0,
        // 分类列表数据
        cateList: [],
        // 当前激活项
        active: 0,
        // 二级分类的列表
        cateLevel2: [],
        // 右侧滑动区域滚动条的位置
        scrollTop: 0
      };
    },
    onLoad() {
      const windowInfo = uni.getWindowInfo()
      this.wh = windowInfo.windowHeight
      // 获取分类列表数据
      this.getCateList()
    },
    methods: {
      // 获取分类列表数据
      async getCateList() {
        const { data: res } = await uni.$http.get("/api/public/v1/categories")
        if (res.meta.status !== 200) return uni.$showMsg()
        // 转存数据
        // 一级分类
        this.cateList = res.message
        // 二级分类
        this.cateLevel2 = res.message[0].children
      },
      // 点击某个一级菜单改变active的值为当前点击的菜单的索引
      activeChanged(index) {
        this.active = index
        // 重新为二级分类的数据赋值
        this.cateLevel2 = this.cateList[index].children
        // 设置scrollTop的值，回到顶部
        this.scrollTop = this.scrollTop === 0 ? 0.1 : 0
      },
      // 点击某个三级分类图片，跳转到商品列表页面
      gotoGoodsList(item) {
        uni.navigateTo({
          url: `/subpkg/goods_list/goods_list?cid=${item.cat_id}`
        })
      }
    }
  }
</script>
<style lang="scss">
  .scroll-view-container {
    display: flex;

    .left-scroll-view {
      width: 120px;

      .left-scroll-view-item {
        background-color: #F7F7F7;
        line-height: 60px;
        text-align: center;
        font-size: 12px;

        &.active {
          background-color: #FFFFFF;
          position: relative;

          &::before {
            content: ' ';
            display: block;
            width: 3px;
            height: 30px;
            background-color: #C00000;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      }
    }

    .cate-lv2-title {
      font-size: 12px;
      text-align: center;
      padding: 15px 0;
      font-weight: bold;
    }

    .cate-lv3-list {
      display: flex;
      flex-wrap: wrap;

      .cate-lv3-item {
        width: 33.33%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-bottom: 10px;

        image {
          width: 60px;
          height: 60px;
        }

        text {
          font-size: 12px
        }
      }
    }
  }
</style>
