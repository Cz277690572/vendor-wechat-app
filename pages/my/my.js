import { Address } from "../../utils/address.js";
import { Order } from "../order/order-model.js";
import { My } from "../my/my-model.js";

var my = new My();
var address = new Address();
var order = new Order();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex: 1,
    orderArr: [],
    isLoadAll: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadData();
    this._getAddressInfo();
  },


  onShow:function(){
    var newOrderFlag = order.hasNewOrder();
    if(newOrderFlag){
      this.refresh();
    }
    
  },

  refresh:function(){
    var that = this;
    this.data.orderArr = []; // 订单初始化
    this._getOrders(() => {
      that.data.isLoadedAll = false; // 是否加载完全
      that.data.pageIndex = 1;
      order.execSetStorageSync(false); // 更新标志位
    });
  },

  _getAddressInfo:function () {
    address.getAddress((addressInfo) => {
      this._bindAddressInfo(addressInfo);
    });
  },

  /**绑定地址信息 */
  _bindAddressInfo: function(addressInfo) {
    this.setData({
      addressInfo: addressInfo
    });
  },

  _loadData:function(){
    // 获取用户头像和昵称可以不需要授权
    // my.getUserInfo((data) => {
    //   this.setData({
    //     userInfo: data
    //   });
    // });
    this._getOrders();
  },

  _getOrders:function(callback){
    order.getOrders(this.data.pageIndex, (res)=>{
      var data = res.data;
      if(data){
        this.data.orderArr.push.apply(this.data.orderArr,data);
        this.setData({
          orderArr: this.data.orderArr
        });
      }
      else{
        this.data.isLoadedAll = true;
      }
      callback && callback();
    })
  },

  /**下拉加载订单 */
  onReachBottom:function(){
    if(!this.data.isLoadedAll) {
      this.data.pageIndex++;
      this._getOrders();
    }
  },

  /**显示订单的具体信息 */
  showOrderDetailInfo: function (event){
    var id = order.getDataSet(event, 'id');
    wx.navigateTo({
      url: '../order/order?from=order&id=' + id
    });
  },

  rePay: function (event) {
    var id = order.getDataSet(event, 'id'),
    index = order.getDataSet(event, 'index');
    this._execPay(id, index);
  },

  _execPay: function (id, index) {
    var that = this;
    order.execPay(id, (statusCode) => {
      if(statusCode > 0){
        var flag = statusCode == 2;
      
        // 更新订单显示状态
        if(flag) {
          that.data.orderArr[index].status = 2;
          that.setData({
            orderArr: that.data.orderArr
          });
        }

        // 跳转到成功页面
        wx.navigateTo({
          url: '../pay-result/pay-result?id='+ id + '&flag=' + flag + '&from=my'
        })
      } 
      else {
        that.showTips('支付失败','商品已下架或库存不足');
      }
    });
  },
  
  /**
  * 提示窗口
  * params
  * title - {string}标题
  * content - {string}内容
  * flag - {bool} 是否跳转到 “我的页面”
  */
  showTips: function (title, content, flag) {
    wx.showModal({
      title: title,
      content: content,
      showCancel: false,
      success: function (res) {
        
      }
    });
  },

  editAddress: function (event) {
    var that = this;
    wx.chooseAddress({
      success: function (res) {
        var addressInfo = {
          name: res.userName,
          mobile: res.telNumber,
          totalDetail: address.setAddressInfo(res)
        }

        // 保存地址
        address.submitAddress(res, (flag,data) => {
          if (!flag) {
            if(data.msg){
              for (let key in data.msg){
                that.showTips('操作提示', data.msg[key]);
              }
            }else{
              that.showTips('操作提示', '地址信息更新失败！');
            }
          }else{
            that._bindAddressInfo(addressInfo)
          }
        });
      }
    })
  },

})