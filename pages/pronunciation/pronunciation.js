// pages/pronunciation/pronunciation.js
const app = getApp();
const innerAudioContext = wx.createInnerAudioContext();
const innerAudioContext1 = wx.getBackgroundAudioManager();
const innerAudioContextchoice = wx.createInnerAudioContext();
const innerAudioContextbg = wx.getBackgroundAudioManager();
let timer = null;
let times = null;
var aa = null;
let count = 10;
let jump;
let s_id;

//倒计时
function countDown(that, count) {
  if (count <= 0) {
    clearTime(that);
    innerAudioContext.stop()
    // 页面>20跳转成绩页面
    if (that.data.currentPages >= (that.data.test_list.length - 1)) {
      // 分数存进接口
      app.getLoginSession((session) => {
        wx.request({
          url: app.api + '/test/addScore',
          method: "GET",
          data: {
            score: that.data.fraction,
            t_session: session
          },
          success: function(res) {
            that.setData({
              s_id: res.data.retval.id
            })
            //跳转成绩页面
            clearTime(that, count);
            wx.redirectTo({
              url: '../result/result?s_id=' + res.data.retval.id,
            })
            return false;
          }
        })
      });
      return false;
    }
    //重置时间
    // countDown(that, 10);
    that.setData({
      //恢复喇叭
      opacity: 1,
      currentPages: that.data.currentPages + 1,
    })
    // that.plea();
    that.firstbgm();
    return;
  }
  that.setData({
    counting: true,
    timeCountDownTop: count,
  })
  timer = setTimeout(function() {
    count--;
    countDown(that, count);
    return;
  }, 1000);
}

// 清空倒计时
function clearTime(that) {
  clearTimeout(timer);
  if (aa){
    clearTimeout(aa);
  };
  // count = 10;
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
    opacity: 1,
    fraction: 0,
    no: false,
    timeCountDownTop: 10,
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
    //清空倒计时
    clearTime(that);
    let test_list = that.data.test_list;
    let pagesIndex = that.data.currentPages;
    let index = e.currentTarget.dataset.index;
    let selIndex = e.currentTarget.dataset.selindex;
    let timeCountDownTop = that.data.timeCountDownTop;
    if (!that.data.dianji || innerAudioContextbg.paused == false) {
      return;
    }
    that.setData({
      dianji: false,
      no:false
    });
    // 判断是否选择正确
    if (test_list[that.data.currentPages].sel[selIndex].value == test_list[that.data.currentPages].analyze) {
      test_list[that.data.currentPages].sel[selIndex].isSel = 1;
      innerAudioContextchoice.src = that.data.file_link1
      innerAudioContextchoice.play()
      innerAudioContextchoice.autoplay = true
      //分数
      that.setData({
        fraction: that.data.fraction + that.data.timeCountDownTop
      })
    } else {
      test_list[that.data.currentPages].sel[selIndex].isSel = 0;
      innerAudioContextchoice.src = that.data.file_link
      innerAudioContextchoice.play()
      innerAudioContextchoice.autoplay = true
    }
    that.setData({
      test_list: test_list,
    })
    times = setTimeout(function () {
      // 题目完成
      if (that.data.currentPages >= (that.data.test_list.length - 1)) {
        //清空倒计时
        clearTime(that, count);
        //本地异步缓存
        wx.setStorage({
          key: "fraction",
          data: that.data.fraction
        });
        // 分数存进接口
        app.getLoginSession((session) => {
          wx.request({
            url: app.api + '/test/addScore',
            method: "GET",
            data: {
              score: that.data.fraction,
              t_session: session
            },
            success: function(res) {
              that.setData({
                s_id: res.data.retval.id
              })
              //跳转成绩页面
              clearTime(that, count);
              wx.redirectTo({
                url: '../result/result?s_id=' + res.data.retval.id
              })
              return false;
            }
          })
        });
        return false;
      }
      //重启倒计时
      // countDown(that, 10);
      innerAudioContext.stop();
      that.setData({
        //恢复喇叭
        opacity: 1,
        // 页面增加
        currentPages: that.data.currentPages + 1,
      })
      // that.plea();
      that.firstbgm();
    }, 1000)
  },

  //不清楚按钮
  unclear: function(e) {
    let that = this;
    clearTime(that);
    if (!that.data.no || innerAudioContextbg.paused == false){
      return;
    }
    that.setData({
      opacity: .8,
      no: false,
      dianji: false,
    })
    // 页面>20跳转成绩页面
    if (that.data.currentPages >= (that.data.test_list.length - 1)) {
      clearTime(that, count);
      // 分数存进接口
      app.getLoginSession((session) => {
        wx.request({
          url: app.api + '/test/addScore',
          method: "GET",
          data: {
            score: that.data.fraction,
            t_session: session
          },
          success: function(res) {
            clearTime(that, count);
            that.setData({
              s_id: res.data.retval.id
            })
            //跳转成绩页面
            wx.redirectTo({
              url: '../result/result?s_id=' + res.data.retval.id
            })
            return false;
          }
        })
      });
      return false;
    }
    setTimeout(() => {
      that.setData({
        //恢复
        opacity: 1,
        // 页面增加
        currentPages: that.data.currentPages + 1,
      })
      that.firstbgm();
    }, 1000)
  },

  //语音按钮  
  taplb: function() {
    if (innerAudioContextbg.paused == false) {
      return;
    }
    let value = this.data.test_list
    let audio = value[this.data.currentPages].word_audio
    innerAudioContext.src = audio
    innerAudioContext.play()
    innerAudioContext.autoplay = true
    this.setData({
      disabled: true
    })
  },

  //首次播放音频
  firstbgm: function () {
    let that = this;
    clearTime(that);
    let value = that.data.test_list;
    let audio = value[that.data.currentPages].word_audio;
    innerAudioContext1.title = '正在播放'
    innerAudioContext1.src = audio;
    innerAudioContext1.play();
    innerAudioContext1.autoplay = true;
    innerAudioContext1.onPlay(() => {
      that.setData({
        timeCountDownTop: 10
      })
    })
    innerAudioContext1.onEnded(() => {
      countDown(that, 10);
      that.setData({
        no: true,
        dianji: true,    
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    that.imageLoad();
    // 题目接口
    app.getLoginSession((session) => {
      wx.request({
        url: app.api + '/test/index',
        data: {
          t_session: session
        },
        success: function (res) {
          // 打乱顺序
          let data = res.data.retval;
          for (let x in data) {
            //判断题目类型是否为看词辨音
            if (data[x].type == 1) {
              data[x].sel = that.index(data[x].sel_one, data[x].sel_two, data[x].analyze);
            } else {
              data[x].sel = that.index(data[x].sel_one, data[x].sel_two, data[x].analyze, data[x].sel_three);
            }
            data[x].bg = that.randombg();
            data[x].sel.sort(that.randomsort);
          }
          // that.plea(data);
          that.setData({
            test_list: res.data.retval,
          })
          that.firstbgm();
        }
      })
    })
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
  },

  // 题目顺序打乱
  index: function(one, two, analyze, three) {
    let arr = [];
    arr.push({
      'value': one,
      'sel': 2,
      "isaudioplay": false,
      "isdianji": true
    });
    arr.push({
      'value': two,
      'sel': 2,
      "isaudioplay": false,
      "isdianji": true
    });
    if (three) {
      arr.push({
        'value': three,
        'sel': 2,
        "isaudioplay": false,
        "isdianji": true
      });
    }
    arr.push({
      'value': analyze,
      'sel': 2,
      "isaudioplay": false,
      "isdianji": true
    });
    return arr
  },


  audioPlay(arr,x,index){
    let test = "test_list[" + index + "].sel";
    innerAudioContextbg.src = arr[x].value;
    arr[x].isaudioplay = true;
    innerAudioContextbg.play();
    innerAudioContextbg.onEnded((res) => {
      arr[x].isaudioplay = false;
      let test = "test_list[" + index + "].sel";
      this.setData({
        [test]: arr
      })
      x++;
      if(x < 3){
        aa = setTimeout(()=>{
          this.audioPlay(arr, x,index);
        },1000)
      } else if (x >= 3){        
        countDown(this, 10)
      }
    })
    this.setData({
      [test]: arr
    })
  },
  
  //判断题目类型是否为看词辨音
  plea: function(data) {
    let that = this;
    let type1 = data||that.data.test_list
    //判断题目类型是否为看词辨音
    if (type1[that.data.currentPages].type == 1) {
      //获取背景音频
      clearTime(that, count);
      that.audioPlay(type1[that.data.currentPages].sel, 0, that.data.currentPages);
    } else{
      if (that.data.currentPages == 0){
        // countDown(that, 10);
      }
    }
  },

  randombg(){
    let err = [];
    //修改成这样的：
    //定义一个while循环，循环的条件是集合arr的子集少于4个
    while (err.length < 4) {
      let t = Math.ceil(Math.random() * 4);//生成随机数
      if (err.indexOf(t) == -1) {
        //如果t在集合arr中存在，indexOf会返回t在集合arr中的位置。
        //如果不存在，indexOf会返回-1
        err.push(t);    //把生成的数字放进这个数组里
      }
    }
    return err[0];
  },

  randomsort(a, b) {
    return Math.random() > .5 ? -1 : 1;
    //用Math.random()函数生成0~1之间的随机数与0.5比较，返回-1或1
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    let that = this;
    clearTime(that, count);
    clearSetTimeOut();
    innerAudioContext1.stop();
  },

  onUnload(){
    let that = this;
    clearTime(that, count);
    clearSetTimeOut();
    innerAudioContext1.stop();
  }
})