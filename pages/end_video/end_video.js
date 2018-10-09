// pages/end_video/end_video.js
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
    let c_id = options.c_id;
    that.setData({
      c_id: options.c_id
    })
    //视频
    app.getLoginSession((session) => {
      wx.request({
        url: app.api + '/words/getVideo',
        method: "GET",
        data: {
          c_id: c_id,
          t_session: session
        },
        success: function (res) {
          let video = res.data.retval.end_video
          that.setData({
            video: video,
          })
          if (video == "https://word.hmjiang.com/Data/") {
            that.jump();
          }
        }
      })
    });
  },

  jump: function () {
    let that = this;
    let c_id = that.data.c_id;
    wx.navigateBack({
      delta: 1
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
})