
import { Base } from '../../utils/base.js';
class Home extends Base
{
  constructor(){
    super();
  }

  getBannerData(id, callback){
    var params = {
      url: 'banner/'+id,
      sCallback:function(res){
        callback && callback(res.items);
      }
    }
    this.request(params);
  }

  getThemeData(callback){
    var param = {
      url: 'theme/by/ids?'+'ids=1,2,3',
      sCallback:function(res){
        callback && callback(res);
      }
    }
    this.request(param);
  }

  getProductsData(callback){
    var param = {
      url: 'product/recent',
      sCallback:function(res){
        callback && callback(res);
      }
    }
    this.request(param);
  }
}

export {Home};