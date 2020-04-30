// pages/about/about.js
import { About } from "./about-model";
var about = new About();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    'logoUrl': '',
    'logoBgUrl': '',
    'siteName': '',
    'siteIntro': '',

    'contactWayATitle': '',
    'contactWayAImg': '',

    'contactWayBTitle': '',
    'contactWayBImg': '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    about.getAboutUs((data)=>{
      that.setData({
        'logoUrl': data.site_logo,
        'logoBgUrl': data.site_logo_bg,
        'siteName': data.site_name,
        'siteIntro': data.site_intro,

        'contactWayATitle': data.contact_way_a_title,
        'contactWayAImg': data.contact_way_a_img,

        'contactWayBTitle': data.contact_way_b_title,
        'contactWayBImg': data.contact_way_b_img
      })
    });
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




  onGroupWechatImg:function(event){
    var url = event.currentTarget.dataset.url;
    var urls = [url];
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },

  onOfficialAccountWechatImg:function(event){
    var url = event.currentTarget.dataset.url;
    var urls = [url];
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
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