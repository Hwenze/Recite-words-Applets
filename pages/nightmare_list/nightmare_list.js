// pages/nightmare_list/nightmare_list.js
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
    clearTime(that, count);
    // 页面>20跳转成绩页面
    if (that.data.currentPages >= (that.data.countg - 1)) {
      clearTime(that, count);
      wx.navigateBack({
        url: '../nightmare/nightmare'
      })
      return false;
    }
    countDown(that, 15);
    that.setData({
      //恢复
      opacity: 1,
      carom:0,
      currentPages: that.data.currentPages + 1,
    })
    that.taplb();
    return;
  }
  that.setData({
    counting: true,
    timeCountDownTop: count,
    timeTop: count,
  })
  timer = setTimeout(function () {
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
    counting: false,
    carom: 0,
    lianji:'none',
    no: false,
    dianji: false
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
    let w_id = test_list[pagesIndex].w_id
    let value = test_list[pagesIndex].sel[selIndex].value;
    if (!that.data.dianji) {
      return;
    }
    that.setData({ 
      dianji: false,
      no:false,
    });
    // 触发点击接口存进数据库
    app.getLoginSession((session) => {
      wx.request({
        url: app.api + '/words/confirmErrorWord',
        method: "GET",
        data: {
          w_id: w_id,
          id: id,
          daan: value,
          t_session: session
        }
      })
    });
    // 判断是否选择正确
    if (test_list[pagesIndex].sel[selIndex].value == test_list[pagesIndex].analyze) {
      test_list[pagesIndex].sel[selIndex].isSel = 1;
      innerAudioContextchoice.src = that.data.file_link1
      innerAudioContextchoice.play()
      innerAudioContextchoice.autoplay = true
      if (that.data.timeCountDownTop >= 11) {
        that.setData({
          carom: that.data.carom + 1,
          lianji: 'block',
        })
        if (that.data.carom > 1) {
          that.setData({
            combo: 'block',
          })
        }
      } else {
        that.setData({
          carom: 0,
          lianji: 'none',
        })
      }
    } else {
      test_list[pagesIndex].sel[selIndex].isSel = 0;
      //显示正确选项
      if (test_list[pagesIndex].sel[0].value == test_list[pagesIndex].analyze) {
        test_list[pagesIndex].sel[0].isSel = 1;
      } else if (test_list[pagesIndex].sel[1].value == test_list[pagesIndex].analyze) {
        test_list[pagesIndex].sel[1].isSel = 1;
      } else if (test_list[pagesIndex].sel[2].value == test_list[pagesIndex].analyze) {
        test_list[pagesIndex].sel[2].isSel = 1;
      } else if (test_list[pagesIndex].sel[3].value == test_list[pagesIndex].analyze) {
        test_list[pagesIndex].sel[3].isSel = 1;
      }
      innerAudioContextchoice.src = that.data.file_link
      innerAudioContextchoice.play()
      innerAudioContextchoice.autoplay = true
      that.setData({
        carom: 0,
        lianji: 'none',
      })
    }
    that.setData({
      test_list: test_list,
      timeTop: 10,
    })
    times = setTimeout(function () {
      that.taplbtime();
    }, 300);
    // 页面做完跳转成绩页面
    if (that.data.currentPages >= (that.data.countg - 1)) {
      clearTime(that, count);
      //传值 跳转到打卡页面
      setTimeout(() => {
        wx.navigateBack({
          url: '../nightmare/nightmare'
        })
      }, 2800)
      return false;
    }
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
    }, 2800);
  },

  //不清楚按钮
  unclear: function (e) {
    let that = this;
    let test_list = that.data.test_list;
    let pagesIndex = that.data.currentPages;
    let id = test_list[pagesIndex].id;
    let c_id = test_list[pagesIndex].c_id
    if (!that.data.no) {
      return;
    }
    clearTime(that, count);
    that.setData({
      no: false,
      dianji: false,
      opacityno: .8,
    })
    clearTime(that, count);
    // 页面>20跳转成绩页面
    if (that.data.currentPages >= (that.data.countg - 1)) {
      wx.navigateBack({
        url: '../nightmare/nightmare'
      })
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
        carom: 0,
        lianji: 'none',
      })
      that.taplb();
    }, 1500)
  },

  //语音按钮
  taplb: function () {
    let that = this;
    let value = that.data.test_list;
    let audio = value[that.data.currentPages].word_audio;
    innerAudioContext.src = audio
    innerAudioContext.play()
    innerAudioContext.autoplay = true
    innerAudioContext.onEnded(() => {
      that.setData({
        dianji: true,
        no: true,
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
  onLoad: function (options) {
    let id = options.id;
    let that = this;
    that.imageLoad();
    //加载题目
    app.getLoginSession((session) => {
      wx.request({
        url: app.api + '/words/errorWordsList',
        data: {
          t_session: session,
          // id:id
        },
        success:function (res) {
          // 打乱顺序
          let data = res.data.retval;
          for (let x in data) {
            data[x].sel = that.index(data[x].sel_one, data[x].sel_two, data[x].sel_three, data[x].analyze);
            data[x].sel.sort(that.randomsort);
          }
          that.setData({
            test_list: res.data.retval,
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
    //题目总数
    app.getLoginSession((session) => {
      wx.request({
        url: app.api + '/words/errorWords',
        method: "GET",
        data: {
          t_session: session
        },
        success: function (res) {
          that.setData({
            countg: res.data.retval.count
          })
        }
      })
    });
  },

  // 题目顺序打乱
  index: function (one, two, three, analyze) {
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
  onReady: function () {
    var that = this;
    if (!that.data.counting) {
      //开始倒计时15秒
      countDown(that, 15);
    }
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
    let that = this;
    clearTime(that, count);
    clearSetTimeOut();
    innerAudioContext.stop();
  },

  onUnload() {
    let that = this;
    clearTime(that, count);
    clearSetTimeOut();
    innerAudioContext.stop();
  }
})