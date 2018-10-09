//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    moba1: 'none',
    moba3:'none',
    shipin: 'block',
    muted: false,
  },

  imageLoad: function() {
    this.setData({
      windowHeight: wx.getSystemInfoSync().windowHeight
    })
  },

  onLoad: function() {
    let that = this;
    wx.getSetting({
      success: function(res) {
        that.setData({
          user_status: res.authSetting['scope.userInfo']
        })
      }
    });
    that.getData();
    that.imageLoad();
  },

  getData: function() {
    var that = this;
    wx.request({
      //请求地址
      url: app.api + '/index/getSlideImages',
      //请求成功
      success: function(e) {
        var data = e.data;
        if (data.done && data.retval) { // 成功
          that.setData({
            photo: e.data.retval.photo,
            loadinged: true
          });
        } else {
          // 失败
          that.setData({
            errorTips: app.errorTips
          })
        }
      },
      // 请求失败
      fail: function() {
        that.setData({
          errorTips: app.errorTips
        })
      },
      // 请求完成
      complete: function() {
        that.setData({
          loading: false
        })
      },
    })

    //主页图片
    app.getLoginSession((session) => {
      wx.request({
        url: app.api + '/index/getMoudleImage',
        method: "GET",
        data: {
          t_session: session
        },
        success: function(res) {
          that.setData({
            image_1: res.data.retval.image_1,
            image_2: res.data.retval.image_2,
            image_3: res.data.retval.image_3,
            image_4: res.data.retval.image_4,
            image_5: res.data.retval.image_5,
            image_6: res.data.retval.image_6,
            image_7: res.data.retval.image_7,
            tishi: res.data.retval.tishi,
          })
        }
      })
    });

    // 触发点击接口存进数据库
    app.getLoginSession((session) => {
      wx.request({
        url: app.api + '/words/getFifth',
        method: "GET",
        data: {
          t_session: session
        },
        success: function(res) {
          that.setData({
            ten_word: res.data.retval.ten_word,
            fiften_word: res.data.retval.fiften_word,
            fifth_word: res.data.retval.fifth_word
          })
        }
      })
    });

    //噩梦词库总数
    app.getLoginSession((session) => {
      wx.request({
        url: app.api + '/index/countError',
        method: "GET",
        data: {
          t_session: session
        },
        success: function(res) {
          that.setData({
            count: res.data.retval.count
          })
        }
      })
    });

    // 公告
    app.getLoginSession((session) => {
      wx.request({
        url: app.api + '/message/index',
        method: "GET",
        data: {
          t_session: session,
        },
        success: function(res) {
          that.setData({
            msgList: res.data.retval
          })
        }
      })
    });

    //模块id
    wx.getStorage({
      key: 'modular_id',
      success: function(res) { 
        that.setData({
          modular_id: res.data
        })
      }
    });

    //雅思托福
    wx.getStorage({
      key: 'id',
      success: function(res) {
        that.setData({
          bookid: res.data
        })
        app.getLoginSession((session) => {
          wx.request({
            url: app.api + '/index/selBooks',
            data: {
              id: that.data.bookid,
              t_session: session
            }
          })
        })
      },
      fail: function() {
        app.getLoginSession((session) => {
          wx.request({
            url: app.api + '/Book/getList',
            data: {
              t_session: session
            },
            success: function(res) {
              that.setData({
                bookid: res.data.retval.list[0].id
              })
              app.getLoginSession((session) => {
                wx.request({
                  url: app.api + '/index/selBooks',
                  data: {
                    id: that.data.bookid,
                    t_session: session
                  }
                })
              })
            }
          })
        })
      }
    })
  },

  books: function() {
    wx.navigateTo({
      url: '../choice/choice'
    })
  },

  introduce() {
    wx.navigateTo({
      url: '../introduce/introduce'
    })
  },

  pronunciation: function() {
    app.getLoginSession((session) => {
      wx.request({
        url: app.api + '/test/isShare',
        method: "GET",
        data: {
          t_session: session
        },
        success: function(res) {
          if (res.data.retval.result == 1) {
            wx.navigateTo({
              url: '../result/result?s_id=' + res.data.retval.s_id + '&id=' + res.data.retval.id,
            })
          } else {
            wx.navigateTo({
              url: '../test/test'
            })
          }
        }
      })
    })
  },

  jump: function(e) {
    wx.navigateTo({
      url: '../nightmare/nightmare?id=' + e.currentTarget.dataset.id
    })
  },

  jump1: function(event) {
    let that = this;
    let c_id = event.currentTarget.dataset.c_id;
    // 判断该模块是否打卡
    app.getLoginSession((session) => {
      wx.request({
        url: app.api + '/words/isShare',
        method: "GET",
        data: {
          c_id: c_id,
          t_session: session,
        },
        success: function(res) {
          let baioshi = res.data.retval.baioshi;
          if (baioshi == 1) {
            wx.navigateTo({
              url: '../clock/clock?c_id=' + c_id
            })
          } else {
            // 判断是否阅读过该模块
            app.getLoginSession((session) => {
              wx.request({
                url: app.api + '/words/isReading',
                method: "GET",
                data: {
                  c_id: c_id,
                  t_session: session
                },
                success: function(res) {
                  if (res.data.retval == 1) {
                    wx.navigateTo({
                      url: '../subject/subject?c_id=' + c_id
                    })
                  } else {
                    wx.navigateTo({
                      url: '../huan_video/huan_video?c_id=' + c_id,
                    })
                  }
                }
              })
            });
          }
        }
      })
    });
  },

  jump2: function(event) {
    let that = this;
    let c_id = event.currentTarget.dataset.c_id;
    // 判断该模块是否打卡
    app.getLoginSession((session) => {
      wx.request({
        url: app.api + '/words/isShare',
        method: "GET",
        data: {
          c_id: c_id,
          t_session: session,
        },
        success: function(res) {
          let baioshi = res.data.retval.baioshi;
          if (baioshi == 1) {
            wx.navigateTo({
              url: '../clock/clock?c_id=' + c_id
            })
          } else {
            // 判断是否阅读过该模块
            app.getLoginSession((session) => {
              wx.request({
                url: app.api + '/words/isReading',
                method: "GET",
                data: {
                  c_id: c_id,
                  t_session: session
                },
                success: function(res) {
                  if (res.data.retval == 1) {
                    wx.navigateTo({
                      url: '../subject/subject?c_id=' + c_id
                    })
                  } else {
                    wx.navigateTo({
                      url: '../huan_video/huan_video?c_id=' + c_id,
                    })
                  }
                }
              })
            });
          }
        }
      })
    });
  },

  jump3: function(event) {
    let that = this;
    let c_id = event.currentTarget.dataset.c_id;
    // 判断该模块是否打卡
    app.getLoginSession((session) => {
      wx.request({
        url: app.api + '/words/isShare',
        method: "GET",
        data: {
          c_id: c_id,
          t_session: session,
        },
        success: function(res) {
          let baioshi = res.data.retval.baioshi;
          if (baioshi == 1) {
            wx.navigateTo({
              url: '../clock/clock?c_id=' + c_id
            })
          } else {
            // 判断是否阅读过该模块
            app.getLoginSession((session) => {
              wx.request({
                url: app.api + '/words/isReading',
                method: "GET",
                data: {
                  c_id: c_id,
                  t_session: session
                },
                success: function(res) {
                  if (res.data.retval == 1) {
                    wx.navigateTo({
                      url: '../subject/subject?c_id=' + c_id
                    })
                  } else {
                    wx.navigateTo({
                      url: '../huan_video/huan_video?c_id=' + c_id,
                    })
                  }
                }
              })
            });
          }
        }
      })
    });
  },

  jump4() {
    let that = this;
    // 判断该模块是否打卡
    app.getLoginSession((session) => {
      wx.request({
        url: app.api + '/words/isShare',
        method: "GET",
        data: {
          c_id: that.data.modular_id,
          t_session: session,
        },
        success: function (res) {
          let baioshi = res.data.retval.baioshi;
          if (baioshi == 1) {
            wx.navigateTo({
              url: '../clock/clock?c_id=' + that.data.modular_id
            })
          } else {
            // 判断是否阅读过该模块
            app.getLoginSession((session) => {
              wx.request({
                url: app.api + '/words/isReading',
                method: "GET",
                data: {
                  c_id: that.data.modular_id,
                  t_session: session
                },
                success: function (res) {
                  if (res.data.retval == 1) {
                    wx.navigateTo({
                      url: '../subject/subject?c_id=' + that.data.modular_id
                    })
                  } else {
                    wx.navigateTo({
                      url: '../huan_video/huan_video?c_id=' + that.data.modular_id,
                    })
                  }
                }
              })
            });
          }
        }
      })
    });
  },

  frame0(event) {
    let c_id = event.currentTarget.dataset.c_id;
    wx.showModal({
      title: '提示',
      content: '您已完成此秘籍，不过二刷后的输出提升可不止一点点哦，冲刺一下？',
      showCancel: true,
      success: function(res) {
        if (res.confirm) {
          // 清除数据
          app.getLoginSession((session) => {
            wx.request({
              url: app.api + '/words/clearData',
              method: "GET",
              data: {
                c_id: c_id,
                t_session: session
              },
              success: function(res) {
                wx.navigateTo({
                  url: '../subject/subject?c_id=' + c_id
                })
              }
            })
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  frame1(event) {
    let c_id = event.currentTarget.dataset.c_id;
    wx.showModal({
      title: '提示',
      content: '您已完成此秘籍，不过二刷后的输出提升可不止一点点哦，冲刺一下？',
      showCancel: true,
      success: function(res) {
        if (res.confirm) {
          // 清除数据
          app.getLoginSession((session) => {
            wx.request({
              url: app.api + '/words/clearData',
              method: "GET",
              data: {
                c_id: c_id,
                t_session: session
              },
              success: function(res) {
                wx.navigateTo({
                  url: '../subject/subject?c_id=' + c_id
                })
              }
            })
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  frame2(event) {
    let c_id = event.currentTarget.dataset.c_id;
    wx.showModal({
      title: '提示',
      content: '您已完成此秘籍，不过二刷后的输出提升可不止一点点哦，冲刺一下？',
      showCancel: true,
      success: function(res) {
        if (res.confirm) {
          // 清除数据
          app.getLoginSession((session) => {
            wx.request({
              url: app.api + '/words/clearData',
              method: "GET",
              data: {
                c_id: c_id,
                t_session: session
              },
              success: function(res) {
                wx.navigateTo({
                  url: '../subject/subject?c_id=' + c_id
                })
              }
            })
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  wait: function() {
    let that = this;
    that.setData({
      moba3: 'block',
    })
  },

  moba: function() {
    let that = this;
    that.setData({
      moba1: 'block',
    })
  },

  moba1: function() {
    let that = this;
    that.setData({
      moba1: 'none',
    })
  },

  moba3: function () {
    let that = this;
    that.setData({
      moba3: 'none',
    })
  },

  bindGetUserInfo(e) {
    this.setData({
      user_status: true,
    })
    let encryptedData = e.detail.encryptedData;
    let iv = e.detail.iv;
    app.getLoginSession((session) => {
      wx.request({
        url: app.api + '/login/getUserInfo',
        method: "POST",
        data: {
          t_session: session,
          encryptedData: encryptedData,
          iv: iv,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
        }
      })
    });
  },

  onShow() {
    if (this.data.loadinged) {
      this.getData();
    }
  }
})