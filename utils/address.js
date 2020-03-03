import { Base } from 'base.js';
import { Config } from 'config.js';

class Address extends Base {
  constructor(){
    super();
  }

  setAddressInfo(res){
    var province = res.provinceName || res.province,
    city = res.cityName || res.city,
    country = res.countyName || res.country,
    detail = res.detailInfo || res.detail;

    var totalDetail = city + country + detail;
    // 如果是直辖市就没必要加入省名了
    if(!this.isCenterCity(province)){
      totalDetail = province + totalDetail;
    }
    return totalDetail;
  }

  /*是否为直辖市*/
  isCenterCity(name){
    var centerCitys = ['北京市','天津市','上海市','重庆市'],
    flag = centerCitys.indexOf(name) >= 0;
    return flag;
  }

  /**获取我自己的收货地址 */
  getAddress(callback) {
    var that = this;
    var param = {
      url: 'address',
      sCallback: function (res) {
        if(res) {
          res.totalDetail = that.setAddressInfo(res);
          callback && callback(res);
        }
      }
    };
    this.request(param);
  }

  /**更新保存地址 */
  submitAddress(data, callback){
    data = this._setUpAddress(data);
    var param = {
      url: 'address',
      type: 'post',
      data: data,
      sCallback: function(res){
        callback && callback(true, res);
      }, eCallback(res){
        callback && callback(false, res);
      }
    };
    this.request(param);
  }

  /*设置保存收货地址数据*/
  _setUpAddress(res){
    var formData = {
      name: res.userName,
      province: res.provinceName,
      city: res.cityName,
      country: res.countyName,
      mobile: res.telNumber,
      detail: res.detailInfo
    };
    return formData;
  }
}

export {Address}