// pages/home/home.js
var appInstance = getApp()
var api = appInstance.globalData.api
const { $Toast } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 500,    

    api:api,


    // push数据
    page: 0,
    total: 0,
    pushlist: [],
    hasMore: true,
    loadmoreSW: true,//数据首次加载之前的加载动画
    loadingShow: true,//页面下拉加载中动画
  },
  
  loadMore:function(){
    let that = this;
    
    // console.log(that.data.hasMore)
    if (that.data.hasMore){
      that.data.page ++;
      wx.showToast({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”
        title: '加载中',
        icon: 'loading',
        duration: 5500
      })
      wx.request({
        url: that.data.api + '/getpushlist',
        data: {
          page: that.data.page
        },
        method: 'POST',
        header: {
          "Content-Type": "application/json"
        },
        success: function (res) {
          // console.log('返回数据为：',res.data)
          
          var list = []
          var before = that.data.pushlist
          // that.data.page === 0 ? list = res.data.pushList : list = that.data.pushlist.concat(res.data.pushList)这句语句也可以使用
          if (that.data.page === 0){
            list = res.data.pushList
          }
          else{
            list = before.concat(res.data.pushList)
          }
          that.setData({
            // pushList: res.data.pushList,
            loadmoreSW: true,
            total: res.data.total,
            hasMore: res.data.hasMore ,                       
            pushlist: list , 
            loadingShow : false
          })
          // console.log(that.data.pushlist)
          wx.hideToast()
        }
        
      })

    }
  },

  reFresh:function(){
    this.setData({
      // pushList: res.data.pushList,
      page: 0,
      loadmoreSW: true,
      total: 0,
      hasMore: true,
      pushlist: [],
      loadingShow: false
    })
    this.loadMore()
  },

  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // console.log(this)
    this.loadMore();
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.reFresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.loadMore();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})