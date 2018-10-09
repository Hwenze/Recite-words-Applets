// pages/choice/choice.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    test:'选择此书'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    app.getLoginSession((session) => {
      wx.request({
        url: app.api + '/Book/getList',
        data: {
          t_session: session
        },
        success: function (res) {
          that.setData({
            books: res.data.retval.list
          })
        }
      })
    })
  },

  tabnum:function(e){
    let that = this;
    var id = e.currentTarget.dataset.id; //获取自定义的id
    wx.setStorage({
      key: "id",
      data: id
    });
    wx.setStorage({
      key: 'modular_id',
      data: 3
    });
    app.getLoginSession((session)=>{
      wx.request({
        url: app.api + '/index/selBooks',
        data: {
          id: id,
          t_session: session
        },
        success: function (res) {
          if(res.data.done == true){
            wx.navigateBack({
              delta:1
            })
          }
        }
      })
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