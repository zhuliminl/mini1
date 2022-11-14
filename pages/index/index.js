// index.js
// 获取应用实例
const app = getApp()

let loginSessionId = '30fe371b-9e70-4675-abb2-0909d7526f9e'

Page({
  data: {
    motto: 'hello',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    console.log('saul onLoad', wx.getUserProfile())

    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }

  },
  requestOpenId(code) {
    const URL = "http://192.168.3.25:3500/openId"
    wx.request({
      url: URL,
      method: "POST",
      data: {
        code,
        login_session_id: loginSessionId,
      },
      success: res => {
        if (res.data && res.data.data) {
          const data = res.data.data
          const { session_key = '', open_id = '' } = data



          console.log('saul >>>>>>>>>>>>>>>>>>', data)
        }
        console.log("服务端结果", res.data.data);
      }
    });

  },
  getPhoneNumber(e) {
    console.log('saul getPhoneNumber', e)
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
    const URL = "http://192.168.3.25:3500/loginWithEncryptedPhoneData"
      wx.request({
        url: URL,
        method: "POST",
        data: {
          login_session_id: loginSessionId,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
        },
        success: res => {
          if (res.data && res.data.data) {
            const data = res.data.data
            console.log('saul 用户手机',data)
          }
          console.log("saul 登录后服务端结果", res);
        }
      });



    }
  },
  tryLogin() {
    // 登录
    wx.login({
      success: res => {
        console.log('saul ==================>>>> tryLogin start', res)
        if (res.code) {
          this.requestOpenId(res.code)
          // this.requestOpenId('01179w1w3WYczZ2ln90w3lbKgG379w1a')
        }
      },
      fail: res => {
        console.log('saul tryLoginFailError', res)
      }
    })

  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log('saul >>>>>>>>>>>>>>', res.userInfo)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
