// miniprogram/pages/multi/index.js

import fakeData from './data/fake'

const sliderWidth = 96;
const TAB_TYPE_HOT = 0;
const TAB_TYPE_RECENT = 1;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: 720,
    windowHeight: 1280,
    hotList: [],
    recentList: [],
    tabs: ["热门", "最新"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    wx.stopPullDownRefresh(); //刷新完成后停止下拉刷新动效

    const that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight,
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });

        that.getVideoList();
      }
    });

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

    wx.stopPullDownRefresh() //刷新完成后停止下拉刷新动效

    const that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight,
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });

        that.getVideoList();
      }
    });
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

  // 打乱数组，模拟数据用
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  },


  //tab 点击处理
  tabClick(e) {
    let currIndex = e.currentTarget.id;
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: currIndex
    });

    this.getVideoList(currIndex)
  },

  //获取评论假数据
  getFakeCommentList() {
    let fakeNum = parseInt(Math.random() * 10);
    let arr = [];
    let contPool = ['这个不错！', '笑死我了', '赞一个', '在哪可以找到这东西', '顶', '哈哈哈222333'];
    for (let i = 0; i < fakeNum; i++) {
      let tmp = {};
      tmp.userIcon = "../images/user-icon.svg";
      tmp.content = contPool[parseInt(Math.random() * 5)];
      tmp.timeStr = "2分钟前";
      tmp.userName = "客户id-" + parseInt(Math.random() * 10000);
      arr.push(tmp);
    }

    return arr;

  },

  //获取商品假数据
  getFakeGoodsList() {
    let fakeNum = parseInt(Math.random() * 10);
    let arr = [];
    for (let i = 0; i < fakeNum; i++) {
      let tmp = {};
      tmp.goodsIcon = "../images/comment-empty.svg";
      tmp.price = '¥' + parseInt(Math.random() * 500);
      tmp.goodsName = "模拟商品" + parseInt(Math.random() * 10000);
      arr.push(tmp);
    }

    return arr;
  },

  //模拟获取视频列表
  getVideoList(type) {

    type = parseInt(type) || TAB_TYPE_HOT;


    const ww = this.data.windowWidth;
    const wh = this.data.windowHeight;

    const rw = ww / 3; // 列表图片宽度为windowWidth的1/3

    const totalVideoNum = 18;

    wx.showLoading({
      title: '加载视频列表中',
    });

    //模拟请求延时
    setTimeout(() => {
      let res = [];

      for (let i = 0; i < totalVideoNum; i++) {
        let randomIndex = parseInt(Math.random() * fakeData.length);
        let obj = fakeData[randomIndex];

        //计算缩略图和缩略图容器的宽高
        let thumbnailWidth = rw;
        let thumbnailHeight = (rw / obj.width) * obj.height;

        let thumbnailContWidth = thumbnailWidth;
        let thumbnailContHeight = thumbnailHeight;
        if (obj.height < obj.width) { //宽视频特殊处理
          let r = obj.width / obj.height;
          thumbnailContHeight = thumbnailWidth * r;
        }

        obj.thumbnailWidth = thumbnailWidth + 'px';
        obj.thumbnailHeight = thumbnailHeight + 'px';
        obj.thumbnailContHeight = thumbnailContHeight + 'px';
        obj.thumbnailContWidth = thumbnailContWidth + 'px';

        //计算详情页视频的宽高
        let currVideoWidth = ww;
        let currVideoHeight = wh;
        let currVideoTop = 0;

        if (obj.height < obj.width) {
          let rate = obj.height / obj.width;
          currVideoHeight = ww * rate;
          currVideoWidth = ww;
          currVideoTop = (wh - currVideoHeight) / 2;
        }

        obj.currVideoWidth = currVideoWidth + 'px';
        obj.currVideoHeight = currVideoHeight + 'px';
        obj.currVideoTop = currVideoTop + 'px';

        obj.commentList = this.getFakeCommentList();
        obj.goodsList = this.getFakeGoodsList();

        res.push(obj);
      }

      //设置热门列表数据
      if (type === TAB_TYPE_HOT) {
        this.setData({
          hotList: res
        });
      } else if (type === TAB_TYPE_RECENT) {//设置最新列表数据
        this.setData({
          recentList: res
        });
      }

      const app = getApp();
      app.globalData.currVideoList = res;
      wx.hideLoading();
    }, 500)

  }

});