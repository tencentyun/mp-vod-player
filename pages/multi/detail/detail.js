// miniprogram/pages/multi/detail/detail.js
const plugin = requirePlugin("myPlugin");

Page({

  /**
   * 页面的初始数据
   */
  data: {

    ww: 0, //window width
    wh: 0, //window height
    currVideoHeight: '100%',
    currVideoWidth: '100%',
    currVideoTop: 0,
    currIndex: 0,
    coverImage: null,
    list: null,
    ts: 0,//timeStart
    te: 0,//timeEnd
    hiddenCover: false,
    videoReady: false,
    playerid: 'detail-video',
    playing: false,
    showPlayBtn: false,
    playBtnTop: 0,
    playBtnLeft: 0,
    currTimeStr: '00:00',
    endTimeStr: '00:00',
    canUpdateSlider: true,
    duration: 0,
    sliderValue: 0,
    showOperation: true,
    operationData: null,
    showComment: false,
    currCommentList: [],
    userInput: '',
    commentScrollTop: 0,
    showGoodsList: false,
    currGoodsList: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    const index = parseInt(options.index);
    const app = getApp();

    const vdata = app.globalData.currVideoList[index];
    const cml = vdata.commentList;
    const ww = options.ww;
    const wh = options.wh;

    const currVideoHeight = vdata.currVideoHeight;
    const currVideoWidth = vdata.currVideoWidth;
    const currVideoTop = vdata.currVideoTop;


    const playBtnTop = (wh - 50) / 2 + 'px';
    const playBtnLeft = (ww - 50) / 2 + 'px';

    const goods = vdata.goodsList;

    this.setData({
      coverImage: vdata.coverImage,
      list: app.globalData.currVideoList,
      currIndex: index,
      currCommentList: cml,
      currGoodsList: goods,
      playBtnTop: playBtnTop,
      playBtnLeft: playBtnLeft,
      currVideoHeight: currVideoHeight,
      currVideoWidth: currVideoWidth,
      currVideoTop: currVideoTop,
      ww: ww,
      wh: wh
    })
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

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  //错误处理
  binderror(e) {
    console.log('catch video error:');
    console.log(e);
    wx.showToast({
      title: '视频播放错误',
      icon: 'none'
    })
  },

  //播放时的处理
  bindplay(e) {

    let hc = this.data.hiddenCover;

    this.data.playing = true;

    if (hc === false) {

      setTimeout(() => {
        this.setData({
          hiddenCover: true
        });
      }, 200)


    }
  },

  //触摸屏幕时记录一个时间
  bindtouchstart(e) {
    this.data.ts = e.timeStamp;
  },

  /**
   * 离开屏幕时判断，如果间隔小于100ms则认为是普通点击，触发暂停/播放操作；
   * 否则认为是拖拽或者滑动屏幕操作，不触发暂停/播放；
   * @param e
   */
  bindtouchend(e) {

    this.data.te = e.timeStamp;

    let cost = this.data.te - this.data.ts;
    if (cost < 100) {

      let ctx = plugin.getContext(this.data.playerid);
      if (this.data.playing) {
        ctx.pause();
        this.data.playing = false;
        this.setData({
          showPlayBtn: true
        })
      } else {
        ctx.play();
        this.data.playing = true;
        this.setData({
          showPlayBtn: false
        })
      }


    } else {
      //console.log('drag...')
    }
  },


  swiperchange(e) {

    //let currIndex = e.detail.current;

  },

  //滑动屏幕结束时加载下一个视频
  swiperanimateend(e) {

    const ci = e.detail.current;
    if (ci !== this.data.currIndex) {

      const app = getApp();
      const vdata = app.globalData.currVideoList[ci];

      const currVideoHeight = vdata.currVideoHeight;
      const currVideoWidth = vdata.currVideoWidth;
      const currVideoTop = vdata.currVideoTop;

      this.data.sliderValue = 0;

      this.setData({
        currIndex: ci,
        hiddenCover: false,
        showComment: false,
        showGoodsList: false,
        showPlayBtn: false,
        showOperation: true,
        currVideoHeight: currVideoHeight,
        currVideoWidth: currVideoWidth,
        currVideoTop: currVideoTop
      })
    }


  },

  //video时间更新触发
  bindtimeupdate(e) {

    if (this.data.canUpdateSlider) { //判断拖拽完成后才触发更新，避免拖拽失效
      let d = e.detail.detail.duration;
      let sliderValue = e.detail.detail.currentTime / d * 100;
      let ct = this.getSMPTEbySeconds(parseInt(d * (sliderValue / 100)));
      let et = this.getSMPTEbySeconds(parseInt(d));
      this.setData({
        currTimeStr: ct,
        sliderValue: sliderValue,
        duration: e.detail.detail.duration,
        endTimeStr: et
      })
    }

  },

  //进度条滑块变化时触发视频seek定位
  sliderChange(e) {

    if (this.data.duration) {
      const ctx = plugin.getContext(this.data.playerid);
      ctx.seek(e.detail.value / 100 * this.data.duration);
      this.setData({
        sliderValue: e.detail.value,
        canUpdateSlider: true //完成拖动后允许更新滚动条
      })
    }


  },

  //滑块拖动过程处理
  sliderChanging(e) {
    const sv = e.detail.value;
    const d = this.data.duration;
    const res = this.getSMPTEbySeconds(parseInt(d * (sv / 100)));

    this.setData({
      currTimeStr: res,
      canUpdateSlider: false //拖拽过程中，不允许更新进度条
    });
  },

  //获取形如 xx:xx 的时间格式
  getSMPTEbySeconds(seconds) {

    let s = Math.floor(seconds);
    let m = Math.floor(s / 60);

    m = m % 60;
    s = s % 60;

    if (s < 10) {
      s = 0 + '' + s;
    }
    if (m < 10) {
      m = 0 + '' + m;
    }

    return m + ':' + s;

  },

  //点赞处理
  toggleLike() {
    const status = !!this.data.isLiked;

    const res = !status;
    this.setData({
      isLiked: res
    });
  },

  //切换显示评论区域
  toggleComment() {

    const status = !!this.data.showComment;
    const res = !status;
    this.setData({
      showComment: res,
      showOperation: !res
    });

  },

  //关闭评论区域
  closeComment() {

    const res = false;
    this.setData({
      showComment: res,
      showOperation: !res
    });
  },

  //发一条评论
  sendComment(e) {

    const v = e.detail.value;

    const cl = this.data.currCommentList;

    const tmp = {};
    tmp.userIcon = "../images/user-icon.svg";
    tmp.content = v;
    tmp.timeStr = "刚刚";
    tmp.userName = "我";
    cl.unshift(tmp);

    this.setData({
      currCommentList: cl,
      userInput: '', // 发表评论后清理input
      commentScrollTop: 0 //发表评论后回到顶部
    })


  },

  //跳转到商品列表页
  gotoShowGoodsList() {

    this.data.showOperation = false;

    this.setData({
      showOperation: false,
      showGoodsList: true
    })

  },

  //关闭商品列表
  closeGoodsList() {

    this.setData({
      showGoodsList: false,
      showOperation: true
    })

  },

  preventEvent() {
    return;
  },

  //跳转到商品详情页
  gotoGoodsDetail() {
    wx.navigateTo({
      url: '../goods/goods',
    })
  }






});