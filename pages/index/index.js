//index.js
//获取应用实例
const app = getApp()
const api = app.globalData.api;
const { $Message } = require('../../dist/base/index');
const loginCode = app.globalData.loginCode;
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),


    HOST: api,

    msgbox1:false,//查询数据库是否有openid，如果没有，则设置haswebuser值为true
    msgbox2:false,//弹出提示框 询问用户是否绑定账号
  },
  
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../home/home'
    })
  },
  onLoad: function () {
    // if (app.globalData.isFirstLogin) {
    //   this.setData({
    //     msgbox1: true
    //   })
    // }
    console.log('全局参数在这里！',app.globalData)
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      // this.postUserInfo(app.globalData.userInfo)
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        // this.postUserInfo(res.userInfo)
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          // this.postUserInfo(res.userInfo)
        }
      })
    }
  },
  getUserInfo: function(e) {
    let that = this
    console.log('这是什么',e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    var objz = {};
    objz.avatarUrl = e.detail.userInfo.avatarUrl;
    objz.nickName = e.detail.userInfo.nickName;
    //console.log(objz);
    wx.setStorageSync('userInfo', objz);//存储userInfo
    // this.postUserInfo()
  },
  
  hasWebUser: function () {
    this.setData({
      msgbox1: false,
      msgbox2:true
    })
  },
  skip1: function () {
    this.saveWechatUser(
      //回调函数
      this.setData({
        msgbox1: false
      })
    )    
  },
  goToBindUser:function(){
    this.handleWarning()
  },
  handleWarning() {
    $Message({
      content: '功能开发中，敬请期待！',
      type: 'warning'
    });
    // 功能尚未开发完成 暂时跳过这一步 18.7.26
    this.skip2();
  },
  skip2:function(){

    this.saveWechatUser(
      //回调函数
      this.setData({
        msgbox2: false
      })
    )    
  },
  saveWechatUser:function(cb){
    let that = this;
    let info = wx.getStorageSync('userInfo')
    console.log('?????', app.globalData.loginCode)
    wx.request({
      url: this.data.HOST + '/createWechatUser',
      data: {
        userInfo: info,
        loginCode: app.globalData.loginCode
      },
      method: 'POST',
      success: res => {
        console.log(res)
        cb;//执行回调
      }
    })
  },
})
