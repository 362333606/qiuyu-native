<template>
    <view style="height: 100%">
        <view class="container">
            <view class="tab-container">
                <view class="tab-item active">
                    <view class="goods-text" v-html="htmlContent" style="padding: 20rpx;">
                        <!-- <template is="wxParse" :data="wxParseData:activity.nodes"/> -->
                        <!-- <mp-html style="padding: 20rpx;" :content="article_activity"></mp-html> -->
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
// pages/freshman/freshman.js
const app = getApp();
const AUTH = require('../../utils/auth');
const TOOLS = require('../../utils/tools.js');
export default {
	data() {
		return {
		  wxlogin: true,
		  bgPic: null,
		  bgColor: null,
		  wxlogin: true,
		  htmlContent: '',
		  headerTitle:''
		};
	},/**
 * 生命周期函数--监听页面加载
*/
onLoad: function (options) {
  /*
  if(app.globalData.iphone){
  this.setData({
  iphone: 'iphone'
  })
  } */

  //获取指定活动
  let that = this;
  this.ajax(this.url.newsDetail,"get",{id: options.id},function(resp){
  	that.htmlContent = resp.data.content;
  	uni.setNavigationBarTitle({
  		title: resp.data.title
  	});
  })
},
/**
 * 生命周期函数--监听页面初次渲染完成
 */
onReady: function () {},
onShow() {
  this.onShowClone();
},
/**
 * 生命周期函数--监听页面隐藏
 */
onHide: function () {},
/**
 * 生命周期函数--监听页面卸载
 */
onUnload: function () {},
/**
 * 页面相关事件处理函数--监听用户下拉动作
 */
onPullDownRefresh: function () {},
/**
 * 页面上拉触底事件的处理函数
 */
onReachBottom: function () {},
/**
 * 用户点击右上角分享
 */
onShareAppMessage: function () {},
methods: {
    onShowClone() {
      AUTH.checkHasLogined().then(isLogined => {
        if (isLogined)
          {} else {
          this.setData({
            wxlogin: isLogined
          });
        }
      });
    },

    afterAuth() {
      this.setData({
        wxlogin: true
      });
    },

    cancelLogin() {
      this.setData({
        wxlogin: true
      });
    },
}};
</script>
