/**
 * @作者 levi
 * @个人项目
 * @创建时间 2020/4/19 18:18
 */
import {Base} from "../../utils/base.js";

class Express extends Base{
    /**
     * 获取运费信息
     */
    getServiceInfo(callback){
        var allParams = {
            url: 'express/service_info',
            sCallback: function (data) {
                callback && callback(data);
            },
            eCallback: function(){
            }
        };
        this.request(allParams);
    }

    /**
     * 获取物流信息
     */
    getLogisticsInfo(code, no, callback){
        var allParams = {
            url: 'express/logistics_info?code=' + code + '&no=' + no,
            sCallback: function (data) {
                callback && callback(data);
            },
            eCallback: function(){
            }
        };
        this.request(allParams);
    }
}

export {Express}
 