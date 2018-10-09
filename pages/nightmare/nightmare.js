// pages/nightmare/nightmare.js
const app = getApp();
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
    that.setData({
      id: options.id
    })
    that.getData();
  },

  getData(){
    let that = this;
    app.getLoginSession((session) => {
      wx.request({
        url: app.api + '/words/errorWords',
        method: "GET",
        data: {
          id:that.data.id,
          t_session: session
        },
        success: function (res) {
          that.setData({
            name: res.data.retval.name,
            count: res.data.retval.count,
            list: res.data.retval.list,
            loaded:true
          })
        }
      })
    });

    //书籍列表
    app.getLoginSession((session) => {
      wx.request({
        url: app.api + '/book/getOpenBooks',
        data: {
          t_session: session
        },
        success: function (res) {
          that.setData({
            books: res.data.retval
          })
        }
      })
    })
  },

  bindPickerChange: function (e) {
    let that = this;
    app.getLoginSession((session) => {
      wx.request({
        url: app.api + '/words/errorWords',
        method: "GET",
        data: {
          id: that.data.books[e.detail.value].id,
          t_session: session
        },
        success: function (res) {
          that.setData({
            name: res.data.retval.name,
            count: res.data.retval.count,
            list: res.data.retval.list,
            id: that.data.books[e.detail.value].id,
            books_index: e.detail.value,
            loaded: true
          })
        }
      })
    });
    app.getLoginSession((session) => {
      wx.request({
        url: app.api + '/index/selBooks',
        data: {
          id: that.data.books[e.detail.value].id,
          t_session: session
        }
      })
    })
  },

  extinct: function () {
    wx.navigateTo({
      url: '../extinct/extinct'
    })
  },

  jump:function(){
    wx.navigateTo({
      url: '../nightmare_list/nightmare_list?id=' + this.data.id
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
    if (this.data.loaded){
      this.getData();
    }
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