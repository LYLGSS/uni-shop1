<template>
  <view class="my-search-container" :style="{'background-color':bgColor}">
    <view class="my-search-box" :style="{'border-radius':radius+'px'}">
      <uni-icons type="search" size="17"></uni-icons>
      <text class="placeholder">搜索</text>
    </view>
  </view>
</template>

<script>
  export default {
    name: "my-search",
    props: {
      // 背景颜色
      bgColor: {
        type: String,
        default: "#C00000"
      },
      // 圆角尺寸
      radius: {
        type: Number,
        default: 18 // px
      }
    },
    data() {
      return {

      };
    }
  }
</script>

<style lang="scss">
  .my-search-container {
    height: 50px;
    // background-color: #C00000;
    padding: 0 10px;
    display: flex;
    align-items: center;

    .my-search-box {
      height: 36px;
      width: 100%;
      background-color: #fff;
      // border-radius: 18px;
      display: flex;
      justify-content: center;
      align-items: center;

      .placeholder {
        font-size: 15px;
        margin-left: 5px;
      }
    }
  }
</style>
