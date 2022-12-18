<template>
  <view>
    <!-- 搜索框 -->
    <view class="search-box">
      <uni-search-bar @confirm="search" placeholder="请输入搜索内容" :radius="100" @input="input" cancelButton="none"
        :focus="true">
      </uni-search-bar>
    </view>

    <!-- 搜索建议列表 -->
    <view class="sugg-list" v-if="searchResults.length!==0">
      <view class="sugg-item" v-for="item in searchResults" :key="item.goods_id" @click="gotoDetail(item)">
        <view class="goods-name">{{item.goods_name}}</view>
        <uni-icons type="right" size="16"></uni-icons>
      </view>
    </view>

    <!-- 搜索历史 -->
    <view class="history-box" v-else>
      <!-- 标题区域 -->
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="17" @click="clean"></uni-icons>
      </view>
      <!-- 列表区域 -->
      <view class="history-list">
        <uni-tag :text="item" v-for="(item,index) in historys" :key="index" @click="gotoGoodsList(item)"></uni-tag>
      </view>
    </view>
  </view>

</template>

<script>
  export default {
    data() {
      return {
        // 延时器标识
        timer: null,
        // 搜索关键词
        kw: '',
        // 搜索结果列表
        searchResults: [],
        // 搜索历史的数据
        historyList: []
      };
    },
    onLoad() {
      // 从本地存储读取关键词
      this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
    },
    computed: {
      historys() {
        // 注意：由于数组是引用数据类型，所以不要直接基于原数组调用 reverse 方法，以免修改元素组的顺序
        // 而是应该新建一个内存无关的数组，再进行 reverse 反转
        return [...this.historyList].reverse()
      }
    },
    methods: {
      // input 输入事件的回调函数
      input(e) {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.kw = e.trim() //去除两端空格
          this.getSearchList()
        }, 500)
      },
      // 获取搜索建议的数据
      async getSearchList() {
        if (this.kw.length === 0) {
          this.searchResults = []
          this.kw = ''
          return
        }
        const { data: res } = await uni.$http.get("/api/public/v1/goods/qsearch", { query: this.kw })
        if (res.meta.status !== 200) return uni.$showMsg()
        this.searchResults = res.message
        // 获取到数据后，将当前的搜索关键词保存
        this.saveSearchHistory()
      },
      // 跳转到商品详情页
      gotoDetail(item) {
        uni.navigateTo({
          url: `/subpkg/goods_detail/goods_detail?goods_id=${item.goods_id}`
        })
      },
      // 保存搜索关键词
      saveSearchHistory() {
        // 使用 Set 进行数组去重，并把新的搜索关键词放在数组末尾，以便在计算属性中进行数组反转后，将新的关键词放在第一位
        const set = new Set(this.historyList)
        set.delete(this.kw) //有重复的 kw 则删除，没有则此句返回 false
        set.add(this.kw)
        this.historyList = Array.from(set) // Array.from(): 将 set 对象转化为数组
        // 将搜索历史记录持久化存储到本地
        uni.setStorageSync('kw', JSON.stringify(this.historyList))
      },
      // 清空搜索历史记录
      clean() {
        // 清空 data 中保存的搜索历史记录
        this.historyList = []
        // 清空本地存储中记录的搜索历史
        uni.removeStorageSync('kw')
      },
      // 跳转到商品列表，并把点击的搜索历史关键词作为参数传递
      gotoGoodsList(kw) {
        uni.navigateTo({
          url: `/subpkg/goods_list/goods_list?query=${kw}`
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .search-box {
    // 吸顶定位
    position: sticky;
    top: 0;
    z-index: 999;

    // 改变 uni-search-bar 的背景颜色
    ::v-deep .uni-searchbar {
      background-color: #C00000;
    }
  }

  .sugg-list {
    padding: 0 5px;

    .sugg-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 13px 0;
      font-size: 12px;
      border-bottom: 1px solid #efefef;

      .goods-name {
        // 文字不允许换行
        white-space: nowrap;
        // 溢出部分隐藏
        overflow: hidden;
        // 文本溢出后，使用 ... 代替
        text-overflow: ellipsis;
      }
    }
  }

  .history-box {
    padding: 0 5px;

    .history-title {
      display: flex;
      justify-content: space-between;
      height: 40px;
      align-items: center;
      font-size: 13px;
      border-bottom: 1px solid #efefef;
    }

    .history-list {
      display: flex;
      flex-wrap: wrap;
      margin-top: 5px;

      ::v-deep .uni-tag {
        display: block;
        margin-bottom: 5px;
        margin-right: 5px;
      }
    }
  }
</style>
