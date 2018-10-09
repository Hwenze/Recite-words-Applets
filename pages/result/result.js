// pages/result/result.js
const app = getApp();
let test_list;
let fenshu;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    fenshu:"",
  },

  imageLoad: function () {
    this.setData({
      windowHeight: wx.getSystemInfoSync().windowHeight
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.imageLoad();
    app.getLoginSession((session) => {
      //加载数据
      wx.request({
        url: app.api + '/test/getScore?id=' + options.s_id,
        data: {
          id: options.s_id,
          t_session: session
        },
        success: function (res) {
          if (res.data.retval.fraction<=25){
            that.setData({
              fenshu :'D',
              jieshi: '少侠的直觉即快又狠，就是木有准确度，在忙碌的日程加上学英语这一项很有必要！'
            })
          }
          if (25<res.data.retval.fraction && res.data.retval.fraction<=50){
            that.setData({
              fenshu: 'C',
              jieshi: '物以C为贵，少侠请自重！单词凭硬记，发音全靠猜！可以不吃喝，学习绝不停！'
            })
          }
          if (50 < res.data.retval.fraction && res.data.retval.fraction<=75) {
            that.setData({
              fenshu: 'B',
              jieshi:'Bravo！少侠对发音基本掌握，不过在某些辅音及连读的发音上会傻傻分不清...'
            })
          }
          if (75 < res.data.retval.fraction && res.data.retval.fraction<=100){
            that.setData({
              fenshu: 'A',
              jieshi:'简直不能更简直了！单词的发音怎么会难倒少侠，赶快发给小伙伴们炫耀一下！'
            })
          }
          that.setData({
            avatar: res.data.retval.avatar,
            truename: res.data.retval.truename,
            fraction: res.data.retval.fraction,
            id: options.id,
          })
        },
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this;
    // 设置菜单中的转发按钮触发转发事件时的转发内容
    var shareObj = {
      title: "发音全靠feel？我的成果在此，你牛你来试试？",// 默认是小程序的名称(可以写slogan等)
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
                id:that.data.id,
                t_session: session
              },
              success: function (res) {
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