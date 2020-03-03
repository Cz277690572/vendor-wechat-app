import { Base } from '../../utils/base.js'

class My extends Base {
  constructor() {
    super();
  }

  // 得到用户的微信信息
  getUserInfo(cb) {
    // 查看是否已经授权过
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              typeof cb == "function" && cb(res.userInfo);
            }
          })
        }
      }, 
      fail: function (res) {
        // 未授权，使用默认头像昵称
        typeof cb == "funciton" && cb({
          avatarUrl: '../../imgs/icon/user@default.png',
          nickName: '零食小贩'
        })
      }
    })
  }
}


export {My}