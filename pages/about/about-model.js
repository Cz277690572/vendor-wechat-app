/**
 * @作者 levi
 * @个人项目
 * @创建时间 2020/4/19 18:18
 */
import {Base} from "../../utils/base.js";

class About extends Base{
    /**
     * 获取关于我们的信息
     */
    getAboutUs(callback){
        var allParams = {
            url: 'config/about_us/type?'+'type=1,2,3,5,74,75,76,77,78,79,80',
            sCallback: function (data) {
                callback && callback(data);
            },
            eCallback: function(){
            }
        };
        this.request(allParams);
    }
}

export {About}
