<template>
    <view class="dm-page">
		<view class="dm-head">
			<view class="dm-deco1"></view>
			<view class="dm-deco2"></view>
			<view class="dm-eng-label">QIUYU AI · UNLOCK RECORDS</view>
			<view class="dm-head-name">已解锁赛事</view>
		</view>

		<view class="dm-card dm-empty" v-if="orderList.length == 0">
			<view class="dm-empty-ico"><view class="dm-empty-ico-in"></view></view>
			<view class="dm-empty-t">暂无解锁记录</view>
			<view class="dm-empty-s">解锁的赛事将显示在这里，当日解锁可回看解析</view>
		</view>

		<view class="dm-card" v-if="todayList.length > 0">
			<view class="dm-day-tag"><view class="dm-day-dot"></view>今天 · {{todayStr}}</view>
			<view class="dm-order" v-for="(item, index) in todayList" :key="'t'+index" @click="toDetail(item.code,item.isToday)">
				<view class="od-info">
					<view class="od-name">{{item.goodsName}}</view>
					<view class="od-meta">
						<text class="od-price"><text class="od-price-b">{{item.price}}</text> 金币</text>
						<text class="od-date">{{(item.createDate||'').slice(0,16)}}</text>
					</view>
				</view>
				<view class="od-img">
					<image v-if="item.goodsImg" mode="aspectFill" :src="imagebaseurl+item.goodsImg"></image>
				</view>
				<view class="od-arrow">›</view>
			</view>
		</view>

		<view class="dm-card" v-if="earlierList.length > 0">
			<view class="dm-day-tag dm-day-dim"><view class="dm-day-dot dm-day-dot-dim"></view>更早</view>
			<view class="dm-order dm-order-dim" v-for="(item, index) in earlierList" :key="'e'+index">
				<view class="od-info">
					<view class="od-name">{{item.goodsName}}</view>
					<view class="od-meta">
						<text class="od-price"><text class="od-price-b">{{item.price}}</text> 金币</text>
						<text class="od-date">{{(item.createDate||'').slice(0,16)}}</text>
					</view>
				</view>
				<view class="od-img">
					<image v-if="item.goodsImg" mode="aspectFill" :src="imagebaseurl+item.goodsImg"></image>
				</view>
				<view class="od-arrow">›</view>
			</view>
		</view>

		<view class="dm-tip" v-if="orderList.length > 0">仅当日已解锁赛事可回看解析内容，判定结果以赛事官方判定为准</view>
		<view class="dm-foot">球域AI · 判定结果以赛事官方为准</view>
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
    computed: {
		todayList() {
			return this.orderList.filter(item => item.isToday);
		},
		earlierList() {
			return this.orderList.filter(item => !item.isToday);
		},
		todayStr() {
			let d = new Date();
			let m = d.getMonth() + 1;
			let day = d.getDate();
			return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day;
		}
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
				result = result == null ? [] : result
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
