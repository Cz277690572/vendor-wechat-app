// order.js
import {Cart} from '../cart/cart-model.js';
import {Order} from '../order/order-model.js';
import {Address} from '../../utils/address.js';

var cart    = new Cart();
var order   = new Order();
var address = new Address();
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    expressPrice: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var from = options.from;
    if(from == "cart"){
      this._fromCart(options.account, options.expressPrice);
    }
    else{
      var id = options.id;
      this._fromOrder(id);
    }
  },

  /**从购物车跳转过来的 */
  _fromCart:function(account,expressPrice){
    var productsArr;
    this.data.account = account;
    productsArr = cart.getCartDataFromLocal(true);

    this.setData({
      productsArr: productsArr,
      account: account,
      orderStatus: 0,
      expressPrice: expressPrice,
    });

    /**显示收货地址 */
    address.getAddress((res) => {
      this._bindAddressInfo(res);
    })
  },

  /**从订单跳转过来 */
  _fromOrder: function(id){
    if (id) {
      var that = this;
      // 下单后，支付成功或者失败后，点左上角返回时能够更新订单状态 所以放在onshow中

      order.getOrderInfoById(id, (data) => {
        console.log(data)
        that.setData({
          orderStatus: data.status,
          productsArr: data.snap_items,
          account: data.pay_price,
          basicInfo: {
            orderTime: data.create_time,
            orderNo: data.order_no,
            id: data.id,
          },
          expressInfo: {
            expressCompanyCode: data.express_company_code,
            expressCompanyTitle:data.express_company_title,
            expressSendNo:data.express_send_no,
            expressSendTime:data.express_send_time,
            expressPrice:data.express_price,
          },
          expressPrice: data.express_price,
          id:id
        });

        // 快照地址
        var addressInfo = data.snap_address;
        addressInfo.totalDetail = address.setAddressInfo(addressInfo);
        that._bindAddressInfo(addressInfo);
      });
    }
  },
  onShow: function () {
    if(this.data.id){
      this._fromOrder(this.data.id);
    }
  },

  editAddress:function(event){
    var that = this;
    wx.chooseAddress({
      success:function(res){
        var addressInfo = {
          name: res.userName,
          mobile: res.telNumber,
          totalDetail: address.setAddressInfo(res)
        }

        // 保存地址
        address.submitAddress(res, (flag,data) => {
          if(!flag){
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

  /**
   * 提示窗口
   * params
   * title - {string}标题
   * content - {string}内容
   * flag - {bool} 是否跳转到 “我的页面”
   */
  showTips: function(title, content, flag){
    wx.showModal({
      title:title,
      content:content,
      showCancel:false,
      success:function(res){
        if(flag){
          wx.switchTab({
            url:'/pages/my/my'
          });
        }
      }
    });
  },


  /**绑定地址信息 */
  _bindAddressInfo: function (addressInfo) {
    this.setData({
      addressInfo: addressInfo
    });
  },


  /**下单和付款 */
  pay: function(){
    if(!this.data.addressInfo){
      this.showTips('下单提示','请填写您的收货地址');
      return;
    }
    if(this.data.orderStatus == 0){
      this._firstTimePay();
    } else {
      this._oneMoresTimePay(this.data.id);
    }
  },

  /**从我的订单重新发起发起支付**/
  _oneMoresTimePay: function(id){
    order.execPay(id, (statusCode,data) => {
      console.log(statusCode)
      console.log(data)
      if(statusCode != 0)
      {
        var flag = statusCode == 2;
        wx.navigateTo({
          url: '../pay-result/pay-result?id=' + id
              + '&flag=' + flag + '&from=order'
        });
      }
      else
      {
        wx.showModal({
          title: '下单失败',
          content: data.msg,
          showCancel: false,
          success: function () {
          }
        });
      }
    });
  },

  /**第一次支付 */
  _firstTimePay: function(){
    var orderInfo = [],
    procuctInfo = this.data.productsArr,
    order = new Order();

    for(let i = 0; i < procuctInfo.length; i++){
      orderInfo.push({
        product_id: procuctInfo[i].id,
        count: procuctInfo[i].counts
      });
    }

    var that = this;
    // 支付分两步，第一步是生成订单号，然后根据订单号支付
    order.doOrder(orderInfo, (flag, data) => {
      if(!flag){
        wx.showModal({
          title: '下单失败',
          content: data.msg,
          showCancel: false,
          success: function (data) {
            // that.editAddress()
          }
        });
        return
      }

      // 订单号生成成功
      if(data.pass) {
        // 更新订单状态
        var id = data.order_id;
        that.data.id = id;
        that.data.fromCartFlag = false;

        // 开始支付
        that._execPay(id);
      } else {
        that._orderFail(data); // 下单失败
      }
    })
  },

  /**
   * 下单失败
   * params:
   * data - {obj} 订单结果信息
   */
  _orderFail: function (data) {
    var nameArr = [],
    name = '',
    str = '',
    pArr = data.pStatusArray;
    for(let i = 0; i < pArr.length; i++){
      if(!pArr[i].haveStock) {
        name = pArr[i].name;
        if(name.length > 15) {
          name = name.substr(0, 12) + '...';
        }
        nameArr.push(name);
        if(nameArr.length >= 2) {
          break;
        }
      }
    }
    str += nameArr.join(',');
    if(nameArr.length > 2){
      str += '等';
    }
    str += '缺货';
    wx.showModal({
      title: '下单失败',
      content: str,
      showCancel: false,
      success: function (res) {
      }
    });
  },

  /**
   * 开始支付
   * params:
   * id - {int}订单id
   */
  _execPay: function(id) {
    var that = this;
    order.execPay(id, (statusCode,data) => {
      if(statusCode != 0){
        // 将已经下单的商品从购物车删除
        that.deleteProducts();
        var flag = statusCode == 2;
        wx.navigateTo({
          url: '../pay-result/pay-result?id=' + id
          + '&flag=' + flag + '&from=order'
        });
      }else{
        wx.showModal({
          title: '下单失败',
          content: data.msg,
          showCancel: false,
          success: function () {
          }
        });
      }
    });
  },

  // 将已经下单的商品从购物车删除
  deleteProducts: function () {
    var ids = [],
    arr = this.data.productsArr;
    for (let i = 0; i < arr.length; i++) {
      ids.push(arr[i].id);
    }
    cart.delete(ids);
  },

  showLogisticsInfo: function (event) {
    var code = event.currentTarget.dataset.code;
    var no   = event.currentTarget.dataset.no;
    wx.navigateTo({
      url: '../express/express?code=' + code + '&no=' + no
    });
  }

})