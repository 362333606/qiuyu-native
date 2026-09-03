<template>
    <view style="height: 100%">
        <!-- <view class="header">
			<image src="/static/images/expert_bg.jpg" class="logo-bg"></image>
        </view> -->
		<view class="demand-item" v-if="demand">
			<view class="demand-item-title">以下为付费内容</view>
			<view class="rich-text raw-text-container" v-html="processedHtmlContent" style="padding: 20rpx;"></view>
		</view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            demandId: 0,
			demand:'',
			htmlContent:''
        };
    },
    onLoad: function (options) {
		if (options.code) {
			let ref = this
			ref.ajax(ref.url.payContent, "GET", {code: options.code}, function(resp) {
				ref.demand = resp.msg;
				ref.htmlContent = resp.msg;
			});
		}
    },
	computed: {
	    processedHtmlContent() {
	      // 将 **内容** 替换为 <strong>内容</strong>
	      return this.htmlContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
	    }
	  },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {},
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
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
    onReachBottom: function () {
	
	},
    methods: {
    }
};
</script>
<style>
@import './payContent.css';
</style>
