//app.js
App({
  onLaunch: function () {
    let that = this;
    // 检查登录态
    that.checkSession();
  },

  // 检查登录态
  checkSession: function () {
    var that = this;
    wx.checkSession({

      // 有效
      success: function () {
        //（检测有效且有3rd_session的storage，直接拿，不再请求接口）
        that.getLoginSession(function (res) {
          console.log('本地存储3rd_session为：' + res.data);
        })
      },

      // 失效
      fail: function () {
        that.login();
      }
    })
  },

  // 获取localStorage中的3rd_session，需要登录授权的接口使用
  getLoginSession: function (fn) {
    var that = this;
    wx.getStorage({
      key: 't_session',
      success: function (res) {

        // 有直接执行回调
        typeof fn == 'function' && fn(res.data);
        console.log('从localStorage中拿');
      },
      fail: function () {

        // 没有再次登录拿3rd_session
        that.login(function (res) {
          typeof fn == 'function' && fn(res);
          console.log('从登录接口拿');
        })
      }
    })
  },

  // 用户登录
  login: function (fn) {
    var that = this;
    wx.login({
      success: function (res) {
        console.log('本地登录成功');
        if (res.code) {
          wx.request({
            url: that.api + '/login/wxLogin',
            data: {
              code: res.code
            },
            success: function (result) {
              console.log(result);
              var session = result.data.retval.t_session;

              // 存储3rd_session
              wx.setStorage({
                key: "t_session",
                data: session,
                success: function () {
                  console.log('存储session成功');
                  typeof fn == 'function' && fn(session);
                },
                fail: function () {
                  console.log('存储session失败');
                }
              })
            },
            fail: function (res) {
              console.log(res);
            }
          })

        } else {
          wx.showModal({
            title: '提示',
            content: '获取用户登录态失败！是否重新获取？',
            cancelText: '否',
            confirmText: '是',
            success: function (res) {
              if (res.confirm) {
                that.login();
              }
            }
          })
        }
      },
      fail: function () {
        console.log('本地登录失败');
      }
    });

  },
  // 统一错误提示
  errorTips: '数据加载中...',

  // 接口地址
  api: 'https://word.hmjiang.com/api',
})