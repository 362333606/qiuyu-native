<template>
    <view style="height: 100%">
        
		<view class="no-order" v-if="orderList.length == 0" style="text-align: center;">
		    <image src="/static/images/no-order.png" class="no-order-img"></image>
		    <view class="text" style="font-size: 20px;">暂无解锁记录</view>
		</view>
		<view class="order-list" v-if="orderList.length > 0">
		    <view :class="item.isToday == true ? 'order-item order-item-click' : 'order-item order-item-disable'" 
			v-for="(item, index) in orderList" :key="index" @click="toDetail(item.code,item.isToday)">
				<view class="goods-content">
					<view class="goods-info" style="flex: 2;">
						<view>
							<text class="goods-name">{{item.goodsName}}</text>
						</view>
						<view style="margin-top: 20rpx;">
							<text style="color: #f45656;font-size: 22rpx;">
							<text class="demand-item-price mount-family">{{item.price}}</text>金币</text>
							<text style="font-size: 22rpx;margin-left: 20rpx;">{{item.createDate}}</text>
						</view>
					</view>
					<view class="goods-img" style="flex: 1;">
						<image class="img" mode="aspectFill" :src="imagebaseurl+item.goodsImg" style="width: 50px;height: 50px;"></image>
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
		if(options.token) {
		  uni.setStorageSync("wanju_token", options.token);
		}
		if (!uni.getStorageSync('wanju_token')) {
			uni.showToast({icon: 'none',title: '请登录后再操作'});
			return;
		}
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
		toDetail:function(code,isToday){
			if (isToday) {
				uni.navigateTo({
					url:'/pages/demand/payContent?code='+code
				})
			}
		},
		getList() {
			let ref = this
			let data = {
				page:ref.page,
				pageSize:ref.pageSize,
			}
			ref.ajax(ref.url.orderList, "GET", data, function(resp) {
				let result = resp.data.content
				result.map
				result = result.map(item => {
					return {
					  ...item,
					  isToday: ref.isSameDay(item.createDate, new Date()),
					};
				  });
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
		isSameDay(date1, date2) {
		  // 如果参数是字符串，转换为Date对象
		  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
		  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
		  
		  // 检查是否是有效的Date对象
		  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
		    console.error('Invalid date provided');
		    return false;
		  }
		  
		  // 比较年月日
		  return (
		    d1.getFullYear() === d2.getFullYear() &&
		    d1.getMonth() === d2.getMonth() &&
		    d1.getDate() === d2.getDate()
		  );
		}
    }
};
</script>
<style>
@import './list.css';
</style>
