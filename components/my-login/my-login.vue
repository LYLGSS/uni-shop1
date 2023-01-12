<template>
  <view class="login-container">
    <button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
      <image class="avatar" :src="avatarUrl"></image>
    </button>
    <!-- form 表单，收集用户名 -->
    <form @submit="onSubmit" class="username">
      <view class="nicheng-container">
        <text class="nicheng">昵称</text>
        <input type="nickname" name="nickname" class="weui-input" placeholder="请输入昵称" />
      </view>
      <button type="primary" class="btn-login" form-type="submit">登录</button>
    </form>
    <text class="tips-text">登录后尽享更多权益</text>
  </view>
</template>

<script>
  import { mapMutations, mapState } from 'vuex'
  const defaultAvatarUrl =
    'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

  export default {
    name: "my-login",
    data() {
      return {
        // 头像
        avatarUrl: defaultAvatarUrl,
        // 昵称
        nickName: ''
      };
    },
    computed: {
      ...mapState('m_user', ['redirectInfo'])
    },
    methods: {
      ...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),
      // 设置头像
      onChooseAvatar(e) {
        const { avatarUrl } = e.detail
        this.avatarUrl = avatarUrl
      },
      // 点击登录按钮，获取用户名称，保存用户名称和头像到本地
      onSubmit(e) {
        this.nickName = e.detail.value.nickname
        uni.getUserProfile({
          desc: '获取相关信息',
          success: (res) => {
            // 把获取到的用户头像和昵称合并过来
            res.userInfo.avatarUrl = this.avatarUrl
            res.userInfo.nickName = this.nickName
            // 修改 rawData
            res.rawData = JSON.stringify(res.userInfo)
            // 将用户的基本信息存储到 vuex 中
            this.updateUserInfo(res.userInfo)
            // 获取token
            this.getToken(res)
          }
        })
      },
      async getToken(info) {
        // 获取 code 的值
        const [err, res] = await uni.login().catch(err => err)
        if (err || res.errMsg !== 'login:ok') return uni.$showMsg('登录失败！')
        // 准备参数
        const query = {
          code: res.code,
          encryptedData: info.encryptedData,
          iv: info.iv,
          rawData: info.rawData,
          signature: info.signature
        }
        const { data: loginResult } = await uni.$http.post('/api/public/v1/users/wxlogin', query)
        // if (loginResult.meta.status !== 200) return uni.$showMsg('登录失败！')  // 由于接口问题，此处先注释，不判断登录失败
        // 登录成功，将 token 存储的到 vuex 仓库中（由于没有开发者权限，接口无法返回token，此处先将token写死）
        const token =
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEyLCJpYXQiOjE1MjU0MDIyMjMsImV4cCI6MTUyNTQ4ODYyM30.g-4GtEQNPwT_Xs0Pq7Lrco_9DfHQQsBiOKZerkO-O-o'
        this.updateToken(token)
        // 回到登录之前的页面
        this.navigateBack()
      },
      navigateBack() {
        if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
          uni.switchTab({
            url: this.redirectInfo.from,
            complete: () => {
              this.updateRedirectInfo(null)
            }
          })
        }

      }
    },

  }
</script>

<style lang="scss">
  .login-container {
    height: 900rpx;
    background-color: #F8F8F8;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;

    &::after {
      content: '';
      width: 100%;
      height: 40px;
      background-color: white;
      position: absolute;
      bottom: 0;
      border-radius: 100%;
      transform: translateY(50%);
    }

    .tips-text {
      font-size: 12px;
      color: gray;
    }

    .avatar-wrapper {
      width: 80px;
      height: 80px;
      padding: 0;
      margin-bottom: 30px;

      .avatar {
        width: 80px;
        height: 80px;
      }
    }

    .username {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;

      .nicheng-container {
        width: 100vw;
        height: 45px;
        display: flex;
        align-items: center;
        margin-bottom: 80px;
        border-top: 1px solid #efefef;
        border-bottom: 1px solid #efefef;

        .nicheng {
          margin-left: 15px;
          font-size: 15px;
          white-space: nowrap;
        }

        .weui-input {
          font-size: 14px;
          margin-left: 60px;
          width: 100%;
        }
      }

      .btn-login {
        background-color: #C00000;
        width: 90%;
        border-radius: 100px;
        margin-bottom: 15px;
      }




    }
  }
</style>
