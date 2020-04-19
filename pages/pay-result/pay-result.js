// pay-result.js
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
    this.setData({
      payResult: options.flag,
      id: options.id,
      from: options.from
    });
  },

  /**
   * 查看订单
   */
  viewOrder: function (event) {
    // 返回上个页面
    wx.navigateBack({
      delta: 1
    })

    // wx.switchTab({
    //   url:'/pages/my/my'
    // });
  }

})