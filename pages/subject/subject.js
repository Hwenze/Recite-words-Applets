// pages/subject/subject.js
const app = getApp();
const innerAudioContext = wx.createInnerAudioContext();
const innerAudioContextime = wx.createInnerAudioContext();
const innerAudioContextchoice = wx.createInnerAudioContext();
let timer = null;
let times = null;
let count;
let c_id;

//倒计时
function countDown(that, count) {
  if (count <= 0) {
    if (that.data.currentPages < (that.data.test_list.length - 1)) {
      // 触发点击不清楚接口存进数据库
      app.getLoginSession((session) => {
        let test_list = that.data.test_list;
        let pagesIndex = that.data.currentPages;
        let id = test_list[pagesIndex-1].id;
        wx.request({
          url: app.api + '/words/noSel',
          method: "GET",
          data: {
            w_id: id,
            c_id: that.data.c_id,
            t_session: session
          },
        })
      });
    }
    // 页面做完跳转成绩页面
    if (that.data.currentPages >= (that.data.test_list.length - 1)) {
      app.getLoginSession((session) => {
        let test_list = that.data.test_list;
        let pagesIndex = that.data.currentPages;
        let id = test_list[pagesIndex].id;
        wx.request({
          url: app.api + '/words/noSel',
          method: "GET",
          data: {
            w_id: id,
            c_id: that.data.c_id,
            t_session: session
          },
        })
      });
      if (that.data.transformation == true) {
        setTimeout(() => {
          //请求错题列表
          app.getLoginSession((session) => {
            let test_list = that.data.test_list;
            let pagesIndex = that.data.currentPages;
            let word_day = test_list[pagesIndex].word_day;
            clearTime(that, count);
            wx.request({
              url: app.api + '/words/errorList',
              method: "GET",
              data: {
                c_id: that.data.c_id,
                day: word_day,
                t_session: session
              },
              success: function (res) {
                let data = res.data.retval.list;
                console.log(data)
                if (data.length > 0) {
                  for (let x in data) {
                    data[x].sel = that.index(data[x].sel_one, data[x].sel_two, data[x].sel_three, data[x].analyze);
                    data[x].sel.sort(that.randomsort);
                  }
                  that.setData({
                    transformation: false,
                    currentPages: 0,
                    test_list: data,
                    opacityno: 1,
                  })
                  countDown(that, 15);
                  that.taplb();
                } else {
                  clearTime(that, count);
                  that.setData({
                    max_combo: that.data.carom > that.data.max_combo ? that.data.carom : that.data.max_combo,
                  })
                  wx.setStorage({
                    key: "combo",
                    data: that.data.max_combo
                  })
                  wx.redirectTo({
                    url: '../clock/clock?c_id=' + that.data.c_id
                  })
                  return false;
                }
              }
            })
          });
        }, 1000)
      } else {
        clearTime(that, count);
        that.setData({
          max_combo: that.data.carom > that.data.max_combo ? that.data.carom : that.data.max_combo,
        })
        wx.setStorage({
          key: "combo",
          data: that.data.max_combo
        })
        wx.redirectTo({
          url: '../clock/clock?c_id=' + that.data.c_id
        })
        return false;
      }
      return false;
    }
    clearTime(that, count);
    countDown(that, 15);
    that.setData({
      //恢复
      opacity: 1,
      currentPages: that.data.currentPages + 1,
      carom: 0,
      lianji: 'none',
      max_combo: that.data.carom > that.data.max_combo ? that.data.carom : that.data.max_combo,
    })
    that.taplb();
    return;
  }
  that.setData({
    counting: true,
    timeCountDownTop: count,
    timeTop: count,
  })
  timer = setTimeout(function() {
    count--;
    countDown(that, count);
  }, 1000);
}

// 清空倒计时
function clearTime(that) {
  clearTimeout(timer);
  count = 15;
  that.setData({
    counting: false,
  })
}

// 清空settimeout
function clearSetTimeOut(that) {
  clearTimeout(times);
}


Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentPages: 0,
    combo: 'none',
    opacityno:1,
    opacity: 1,
    counting: false,
    carom: 0,
    lianji: 'none',
    max_combo: 0,
    no: false,
    transformation: true,
    color_status: 0,
    dianji:false
  },

  imageLoad: function () {
    this.setData({
      windowHeight: wx.getSystemInfoSync().windowHeight
    })
  },

  // 答题点击事件
  tapnum(e) {
    let that = this;
    let test_list = that.data.test_list;
    let pagesIndex = that.data.currentPages;
    let selIndex = e.currentTarget.dataset.selindex;
    let id = test_list[pagesIndex].id;
    let c_id = test_list[pagesIndex].c_id
    let option = test_list[pagesIndex].sel[selIndex].value;
    let word_day = test_list[pagesIndex].word_day;
    if (!that.data.dianji) {
      return;
    }
    // 判断是否选择正确
    if (test_list[pagesIndex].sel[selIndex].value == test_list[pagesIndex].analyze) {
      test_list[pagesIndex].sel[selIndex].isSel = 1;
      if (that.data.timeCountDownTop >= 11) {
        that.setData({
          carom: that.data.carom + 1,
          lianji: 'block',
        })
        if (that.data.carom > 1){
          that.setData({
            combo: 'block',
          })
        }
      } else {
        that.setData({
          max_combo: that.data.carom > that.data.max_combo ? that.data.carom : that.data.max_combo,
          carom: 0,
          lianji: 'none',
        })
      }
      //选对错词
      if (that.data.transformation == false) {
        if (that.data.timeCountDownTop >= 10) {
          that.setData({
            color_status: 0
          })
        } else {
          that.setData({
            color_status: 1
          })
        }
      }
      innerAudioContextchoice.src = that.data.file_link1
      innerAudioContextchoice.play()
      innerAudioContextchoice.autoplay = true
    } else {
      //选错错词
      test_list[pagesIndex].sel[selIndex].isSel = 0;
      //显示正确选项
      if (test_list[pagesIndex].sel[0].value == test_list[pagesIndex].analyze){
        test_list[pagesIndex].sel[0].isSel = 1;
      } else if (test_list[pagesIndex].sel[1].value == test_list[pagesIndex].analyze){
        test_list[pagesIndex].sel[1].isSel = 1;
      } else if (test_list[pagesIndex].sel[2].value == test_list[pagesIndex].analyze) {
        test_list[pagesIndex].sel[2].isSel = 1;
      } else if (test_list[pagesIndex].sel[3].value == test_list[pagesIndex].analyze) {
        test_list[pagesIndex].sel[3].isSel = 1;
      }
      if (that.data.transformation == false) {
        that.setData({
          color_status: 2
        })
      }
      that.setData({
        carom: 0,
        lianji: 'none',
        max_combo: that.data.carom > that.data.max_combo ? that.data.carom : that.data.max_combo,
      })
      innerAudioContextchoice.src = that.data.file_link
      innerAudioContextchoice.play()
      innerAudioContextchoice.autoplay = true
    };
    that.setData({
      dianji: false,
      no:false,
      test_list: test_list,
      word_day: word_day,
      timeTop: 10
    });
    // 触发点击接口存进数据库
    app.getLoginSession((session) => {
      wx.request({
        url: app.api + '/words/confirmWord',
        method: "GET",
        data: {
          w_id: id,
          c_id: c_id,
          daan: option,
          color_status: that.data.color_status,
          t_session: session,
        },
        success: function(res) {
          that.setData({
            id:id,
            c_id: c_id,
          })
        }
      })
    });
    times = setTimeout(function () {
      that.taplbtime();
    }, 300);
    // 页面做完跳转成绩页面
    if (that.data.currentPages >= (test_list.length - 1)) {

      if (that.data.transformation == true) {
        clearTime(that, count);
        setTimeout(() => {
          //请求错题列表
          app.getLoginSession((session) => {
            wx.request({
              url: app.api + '/words/errorList',
              method: "GET",
              data: {
                c_id: c_id,
                day: word_day,
                t_session: session
              },
              success: function (res) {
                let data = res.data.retval.list;
                if (data.length > 0) {
                  for (let x in data) {
                    data[x].sel = that.index(data[x].sel_one, data[x].sel_two, data[x].sel_three, data[x].analyze);
                    data[x].sel.sort(that.randomsort);
                  }
                  that.setData({
                    transformation: false,
                    currentPages: 0,
                    test_list: data,
                    combo: 'none',
                  })
                  that.taplb();
                } else {
                  clearTime(that, count);
                  that.setData({
                    max_combo: that.data.carom > that.data.max_combo ? that.data.carom : that.data.max_combo,
                  })
                  wx.setStorage({
                    key: "combo",
                    data: that.data.max_combo
                  })
                  wx.redirectTo({
                    url: '../clock/clock?c_id=' + c_id
                  })
                  return false;
                }
              }
            })
          });
        }, 2800)
      }
      else {
        clearTime(that, count);
        that.setData({
          max_combo: that.data.carom > that.data.max_combo ? that.data.carom : that.data.max_combo,
        })
        wx.setStorage({
          key: "combo",
          data: that.data.max_combo
        })
        setTimeout(() => {
          wx.redirectTo({
            url: '../clock/clock?c_id=' + c_id
          })
        }, 2800)
        return false;
      }
    };  
    clearTime(that, count);
    times = setTimeout(function () {
      countDown(that, 15);
      that.setData({
        // 页面增加
        currentPages: that.data.currentPages + 1,
        //恢复
        opacity: 1,
        combo: 'none',
      })
      that.taplb();
    }, 2800)
  },

  //不清楚按钮
  unclear: function(e) {
    let that = this;
    let test_list = that.data.test_list;
    let pagesIndex = that.data.currentPages;
    let id = test_list[pagesIndex].id;
    let c_id = test_list[pagesIndex].c_id;
    let word_day = test_list[pagesIndex].word_day;
    if (!that.data.no) {
      return;
    }
    that.setData({
      opacityno:.8,
      no: false,
      dianji:false,
      max_combo: that.data.carom > that.data.max_combo ? that.data.carom : that.data.max_combo,
    })
    // 触发点击不清楚接口存进数据库
    app.getLoginSession((session) => {
      wx.request({
        url: app.api + '/words/noSel',
        method: "GET",
        data: {
          w_id: id,
          c_id: c_id,
          t_session: session
        },
      })
    });
    // 完成跳转成绩页面
    if (that.data.currentPages >= (test_list.length - 1)) {

      if (that.data.transformation == true) {
        clearTime(that, count);
        setTimeout(() => {
          //请求错题列表
          app.getLoginSession((session) => {
            wx.request({
              url: app.api + '/words/errorList',
              method: "GET",
              data: {
                c_id: c_id,
                day: word_day,
                t_session: session
              },
              success: function (res) {
                let data = res.data.retval.list;
                if (data.length > 0) {
                  for (let x in data) {
                    data[x].sel = that.index(data[x].sel_one, data[x].sel_two, data[x].sel_three, data[x].analyze);
                    data[x].sel.sort(that.randomsort);
                  }
                  that.setData({
                    transformation: false,
                    currentPages:0,
                    test_list: data,
                    opacityno: 1,
                    no: true,
                  })
                  countDown(that, 15);
                  that.taplb();
                } else {
                  clearTime(that, count);
                  that.setData({
                    max_combo: that.data.carom > that.data.max_combo ? that.data.carom : that.data.max_combo,
                  })
                  wx.setStorage({
                    key: "combo",
                    data: that.data.max_combo
                  })
                  wx.redirectTo({
                    url: '../clock/clock?c_id=' + c_id
                  })
                  return false;
                }
              }
            })
          });
        }, 1000)
      } else {
        clearTime(that, count);
        that.setData({
          max_combo: that.data.carom > that.data.max_combo ? that.data.carom : that.data.max_combo,
        })
        wx.setStorage({
          key: "combo",
          data: that.data.max_combo
        })
        wx.redirectTo({
          url: '../clock/clock?c_id=' + c_id
        })
        return false;
      }
      return false;
    }
    clearTime(that, count);
    setTimeout(() => {
      countDown(that, 15);
      that.setData({
        // 页面增加
        currentPages: that.data.currentPages + 1,
        //恢复
        opacityno: 1,
        opacity: 1,
        carom: 0,
        lianji: 'none',
      })
      that.taplb();
    }, 1500)
  },

  //语音按钮
  taplb: function() {
    let that = this;
    let value = that.data.test_list;
    let audio = value[that.data.currentPages].word_audio;
    innerAudioContext.src = audio
    innerAudioContext.play()
    innerAudioContext.autoplay = true
    innerAudioContext.onEnded(() => {
      that.setData({
        no: true,
        dianji: true
      })
    })
  },

  //延迟语音按钮
  taplbtime: function () {
    let that = this;
    if (innerAudioContext.paused == false) {
      return;
    }
    let value = that.data.test_list
    let audio = value[that.data.currentPages].word_audio
    innerAudioContextime.src = audio
    innerAudioContextime.play()
    innerAudioContextime.autoplay = true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let c_id = options.c_id;
    let that = this;
    that.imageLoad();
    that.setData({
      c_id: c_id,
    })
    //判断模块
    app.getLoginSession((session) => {
      wx.request({
        url: app.api + '/words/isShare',
        data: {
          c_id: c_id,
          t_session: session
        },
        success: function(res) {
          let baioshi = res.data.retval.baioshi;
          if (baioshi == 3) {
            that.setData({
              transformation:false
            })
            // 错词列表
            app.getLoginSession((session) => {
              wx.request({
                url: app.api + '/words/endErrorList',
                method: "GET",
                data: {
                  c_id: c_id,
                  t_session: session
                },
                success: function (res) {
                  // 打乱顺序
                  let data = res.data.retval.list;
                  for (let x in data) {
                    data[x].sel = that.index(data[x].sel_one, data[x].sel_two, data[x].sel_three, data[x].analyze);
                    data[x].sel.sort(that.randomsort);
                  }
                  that.setData({
                    test_list: data,
                    count: res.data.retval.count,
                    word_day: res.data.retval.list[0].word_day,
                    c_id: res.data.retval.list[0].c_id,
                  })
                  that.taplb();
                }
              })
            })
            //选择音频接口
            app.getLoginSession((session) => {
              wx.request({
                url: app.api + '/index/getAuVideo',
                data: {
                  type: 0,
                },
                success: function (res) {
                  that.setData({
                    file_link: res.data.retval.file_link,
                  })
                }
              })
            })
            app.getLoginSession((session) => {
              wx.request({
                url: app.api + '/index/getAuVideo',
                data: {
                  type: 1,
                },
                success: function (res) {
                  that.setData({
                    file_link1: res.data.retval.file_link,
                  })
                }
              })
            })
          } else {
            //题目接口
            app.getLoginSession((session) => {
              wx.request({
                url: app.api + '/words/index',
                data: {
                  c_id: c_id,
                  t_session: session
                },
                success: function(res) {
                  // 打乱顺序
                  let data = res.data.retval.list;
                  for (let x in data) {
                    data[x].sel = that.index(data[x].sel_one, data[x].sel_two, data[x].sel_three, data[x].analyze);
                    data[x].sel.sort(that.randomsort);
                  }
                  that.setData({
                    test_list: data,
                    count: res.data.retval.count,
                    word_day: res.data.retval.list[0].word_day,
                    c_id: res.data.retval.list[0].c_id,
                  })
                  that.taplb();
                }
              })
            })
            //选择音频接口
            app.getLoginSession((session) => {
              wx.request({
                url: app.api + '/index/getAuVideo',
                data: {
                  type: 0,
                },
                success: function (res) {
                  that.setData({
                    file_link : res.data.retval.file_link,
                  })
                }
              })
            })
            app.getLoginSession((session) => {
              wx.request({
                url: app.api + '/index/getAuVideo',
                data: {
                  type: 1,
                },
                success: function (res) {
                  that.setData({
                    file_link1: res.data.retval.file_link,
                  })
                }
              })
            })
          }
        }
      })
    });

    wx.setStorage({
      key: "modular_id",
      data: options.c_id
    })
  },

  // 题目顺序打乱
  index: function(one, two, three, analyze) {
    let arr = [];
    arr.push({
      'value': one,
      'sel': 2,
      "isdianji": false
    });
    arr.push({
      'value': two,
      'sel': 2,
      "isdianji": false
    });
    arr.push({
      'value': three,
      'sel': 2,
      "isdianji": false
    });
    arr.push({
      'value': analyze,
      'sel': 2,
      "isdianji": false
    });
    return arr
  },
  randomsort(a, b) {
    return Math.random() > .5 ? -1 : 1;
    //用Math.random()函数生成0~1之间的随机数与0.5比较，返回-1或1
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this;
    if (!that.data.counting) {
      //开始倒计时15秒
      countDown(that, 15);
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
 * 生命周期函数--监听页面隐藏
 */
  onHide: function () {
    let that = this;
    clearTime(that, count);
    clearSetTimeOut();
  },

  //生命周期回调—监听页面卸载
  onUnload() {
    let that = this;
    clearTime(that, count);
    clearSetTimeOut();
  }
})