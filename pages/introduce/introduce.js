// pages/introduce/introduce.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    app.getLoginSession((session) => {
      wx.request({
        url: app.api + '/index/getIntro',
        method: "GET",
        data: {
          type:0
        },
        success: function (res) {
          that.setData({
            content: res.data.retval.content
          })
          var content = res.data.retval.content;
          var WxParse = require('../../wxParse/wxParse.js');
          WxParse.wxParse('content', 'html', content, that, 5);
        }
      })
    });
  },

  phone(){
    wx.makePhoneCall({
      phoneNumber: '400-179-3240' //电话号码
    })
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
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})