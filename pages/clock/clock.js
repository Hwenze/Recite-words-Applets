// pages/clock/clock.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  imageLoad: function () {
    this.setData({
      windowHeight: wx.getSystemInfoSync().windowHeight,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.imageLoad();
    //数据接口
    app.getLoginSession((session) => {
      wx.request({
        url: app.api + '/words/getWordsShare?c_id=' + options.c_id,
        data: {
          c_id: options.c_id,
          t_session: session,
        },
        success: function (res) {
          let user_id = res.data.retval.id;
          let count = res.data.retval.count;
          let total_count = res.data.retval.total_count;
          let word_day = res.data.retval.word_day;
          let avatar = res.data.retval.avatar;
          let userName = res.data.retval.userName;
          let day_num = res.data.retval.day_num;
          that.setData({
            total_count: total_count,
            word_day: word_day,
            count : count,
            avatar: avatar,
            userName :　userName,
            user_id: user_id,
            day_num: day_num,
            c_id: options.c_id
          })
        }
      })
    })
    wx.getStorage({
      key: 'combo',
      success: function (res) {
        let sum = res.data;
        if (sum == 0){
          that.setData({
            combo: sum
          })
        }else{
          that.setData({
            combo: sum-1
          })
        }   
      }
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
  onShareAppMessage: function (res) {
    var that = this;
    // 设置菜单中的转发按钮触发转发事件时的转发内容
    var shareObj = {
      title: "听单词你还能淡定吗？全新打卡模式我已完成心灵的洗涤，换你看看？ ",// 默认是小程序的名称(可以写slogan等)
      path: '/pages/index/index',// 默认是当前页面，必须是以‘/’开头的完整路径
      success: function (res) {
        // 转发成功之后的回调
        if (res.errMsg == 'shareAppMessage:ok') {
          // 触发点击接口存进数据库
          let ids = that.data.user_id;
          app.getLoginSession((session) => {
            wx.request({
              url: app.api + '/share/getShare',
              method: "GET",
              data: {
                id: ids,
                t_session: session
              },
              success: function (res) {
                //完成该模块视频
                app.getLoginSession((session) => {
                  wx.request({
                    url: app.api + '/words/getWordsShare',
                    data: {
                      c_id: that.data.c_id,
                      t_session: session
                    },
                    success: function (res) {
                      if (res.data.retval.count == res.data.retval.total_count) {
                        wx.redirectTo({
                          url: '../end_video/end_video?c_id=' + that.data.c_id,
                        })
                      }
                    }
                  })
                })
              }
            })
          });
        }
      },
    };

    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return shareObj;
  }
})