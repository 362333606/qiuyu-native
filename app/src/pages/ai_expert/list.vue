<template>
    <view class="page">
		<view class="qiuyu-statusbar"></view>

		<view style="text-align: center;margin: 40rpx;">
			<view>
				<text class="question-bottom-top"><image src="/static/icon/ai.png" style="width: 18px;height: 18px;vertical-align: text-bottom;margin-right: 10rpx;"></image>智能预测模型</text>
			</view>
			<view style="margin-top: 30rpx;"><h3>选择您的AI专家</h3></view>
			<view style="font-size: 24rpx;color: #989ea5;margin-top: 15rpx;">基于深度学习的专业赛事分析模型</view>
		</view>
        
		<view class="no-order" v-if="orderList.length == 0" style="text-align: center;">
		    <image src="/static/images/no-order.png" class="no-order-img"></image>
		    <view class="text" style="font-size: 20px;">暂无Ai专家</view>
		</view>
		
		
		<view class="expert-list">
			<view class="expert-item" v-for="(item, index) in orderList" :key="index">
				<view class="expert-title">
					<view><image :src="imagebaseurl + item.pic"></image></view>
					<view class="expert-title-info">
						<text class="expert-name">{{ item.name }}</text>
						<text style="font-size: 16rpx;color: #0b9bde;background-color: #e2f3fc;border-radius: 20rpx;padding: 8rpx 20rpx;margin-left: 20rpx;">5A级</text>
						<view class="expert-tag" style="margin-top: 10rpx;">{{ item.remark }}</view>
					</view>
					<!-- <view style="flex: 1;text-align: center;">
						<text class="detail-btn" @click="toDetail(item.id)">查看详情</text>
					</view> -->
				</view>
				<!-- <view class="expert-info">
					<view>{{ item.remark }}</view>
				</view> -->
				<view style="border-bottom: 1px solid #f4f6fc;">
					<view class="expert-stat">
						<view class="circle-progress">
						    <view class="circle-bg"></view>
						    <view class="circle-left" :style="getLeftStyle(item.hitRate)" :class="{ zero: item.hitRate == 0 }"></view>
						    <view class="circle-right" :style="getRightStyle(item.hitRate)" :class="{ zero: item.hitRate == 0 }"></view>
						    <view class="progress-text">
								<text>{{ Number(item.hitRate).toFixed(1) }}%</text>
								<text style="font-size: 16rpx;color: #989ea5;">命中率</text>
							</view>
						  </view>
						  
						<view class="expert-stat-item">
							<text>{{ item.predictNum }}</text>
							<view style="margin-top: 5rpx;">预测场次</view>
						</view>
						<view class="expert-stat-item">
							<text style="color: #0c9f71;">{{ Math.round(item.predictNum * item.hitRate / 100) }}</text>
							<view style="margin-top: 5rpx;">命中场次</view>
						</view>
						<view class="expert-stat-item">
							<text style="color: #f5a93c;">{{ item.redNum }}</text>
							<view style="margin-top: 5rpx;">连红</view>
						</view>
					</view>
					
					<view style="margin-bottom: 20rpx;" v-if="item.redNum > 2">
						<text class="hot-tip"><uni-icons type="fire-filled" size="14" color="#f59e0b" style="margin-left: 2px;"></uni-icons>火热状态 . {{ item.redNum }}连红中</text>
					</view>
				</view>
				
				<view class="expert-bottom">
					<view>
						<image src="/static/icon/fenxi.png" style="width: 12px;height: 12px;vertical-align: middle;">
						<text style="font-size: 22rpx;color: #989ea5;margin-left: 10rpx;">实时分析中</text>
						<text class="game-total-text-point"></text>
					</view>
					<view @click="toDetail(item.id)">
						<view class="game-btn mount-family" style="background-color: #0b9bde;">查看详情<uni-icons type="arrow-right" size="16" color="#fff" style="margin-left: 2px;"></uni-icons></view>
					</view>
				</view>
			</view>
		</view>
		
    </view>
</template>

<script>
export default {
    data() {
        return {
           page: 1,
           pageSize: 10,
           totalPages:0,
		   orderList:[],
		   imagebaseurl: this.ossUrl,
        };
    },
    onLoad: function (options) {
		// if(options.token) {
		//   uni.setStorageSync("wanju_token", options.token);
		// }
		// if (!uni.getStorageSync('wanju_token')) {
		// 	uni.showToast({icon: 'none',title: '请登录后再操作'});
		// 	return;
		// }
		this.getList();
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {},
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {},
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
		let that = this
		if (that.isLastPage) return
		that.page = that.page + 1
		that.getList();
	},
    methods: {
		// 右侧圆环角度
		  getRightStyle(percent) {
		    let deg = 0
		    if (percent >= 50) {
		      deg = 180
		    } else {
		      deg = (percent / 50) * 180
		    }
		    return `transform: rotate(${deg}deg)`
		  },
		  // 左侧圆环角度
		  getLeftStyle(percent) {
		    let deg = 0
		    if (percent > 50) {
		      deg = ((percent - 50) / 50) * 180
		    }
		    return `transform: rotate(${deg}deg)`
		  },
		toDetail(expertId){
			uni.navigateTo({
				url:'/pages/ai_expert/detail?expertId='+expertId
			})
		},
		getList() {
			let ref = this
			let data = {
				page:ref.page,
				pageSize:ref.pageSize,
			}
			ref.ajax(ref.url.expertList, "GET", data, function(resp) {
				let result = resp.data.content
				ref.total = resp.data.totalElements;
				if (result == null || result.length == 0){
					ref.isLastPage = true
					ref.page = ref.page - 1
				}else{
					if (ref.page == 1) ref.orderList = []
					ref.orderList = ref.orderList.concat(result)
					console.info(ref.orderList)
					if (ref.page > 1){
						// uni.showToast({
						// 	icon:'none',
						// 	title:"又加载了" + result.length + "个项目"
						// })
					}
				}
			})
		},
    }
};
</script>
<style>
@import './list.css';
</style>
