// category.js
import {Category} from "category-model.js";
var category = new Category();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTabsIndex:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadData();
  },

  _loadData: function (){
    category.getCategoryType((categoryData)=>{
      this.setData({
        categoryTypeArr: categoryData
      });

      // 一定在回调里再进行获取分类详情的方法调用
      category.getProductsByCategory(
        categoryData[0].id,(data) => {
          var dataObj = {
            products:data,
            topImgUrl: categoryData[0].img.url,
            title: categoryData[0].name
          };

          this.setData({
            categoryProducts: dataObj
          })
        }
      );
    });
  },

  onProductsItemTap: function (event) {
    var id = category.getDataSet(event, 'id');
    wx.navigateTo({
      url: '../product/product?id=' + id
    })
  },

  onTabsItemTap: function (event) {
    var index = category.getDataSet(event, 'index');
    this.setData({
      currentTabsIndex: index
    });

    category.getProductsByCategory(
      this.data.categoryTypeArr[index].id, (data) => {
        var dataObj = {
          products: data,
          topImgUrl: this.data.categoryTypeArr[index].img.url,
          title: this.data.categoryTypeArr[index].name
        };

        this.setData({
          categoryProducts: dataObj
        })
      }
    );
  }
})