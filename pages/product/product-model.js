
import {Base} from '../../utils/base.js';

class Product extends Base{
  constructor (){
    super();
  }

  // 获取单个商品详情信息
  getDetailInfo(id, callback){
    var param = {
      url:"product/" + id,
      sCallback: function(data){
        callback && callback(data);
      }
    };
    this.request(param);
  }
}

export {Product}