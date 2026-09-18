<template>
    <view class="dm-page">
		<view class="dm-hero">
			<view class="dm-hero-glow"></view>
			<view class="dm-hero-dots"></view>
			<view class="dm-brand-row">
				<image class="dm-brand-logo" src="/static/qiuyu-logo-w.png" mode="aspectFit"></image>
				<view class="dm-date-chip">{{todayCn}}</view>
			</view>
			<view class="dm-hero-title">解锁记录</view>
			<view class="dm-hero-sub">当日解锁的赛事 <text class="dm-hero-sub-b">可回看完整AI解析</text></view>
		</view>

		<view class="dm-empty-stage" v-if="orderList.length == 0">
			<view class="dm-es-orbit">
				<view class="dm-es-ball"></view>
				<view class="dm-es-badge"></view>
			</view>
			<view class="dm-es-t">还没有解锁记录</view>
			<view class="dm-es-s">解锁赛事即可查看AI深度解析，当日解锁当日随时回看</view>
			<view class="dm-es-go" @click="goHome">去解锁赛事</view>
		</view>

		<block v-if="orderList.length > 0">
			<view class="dm-stats-glass">
				<view class="dm-sg dm-sg-blue">
					<view class="dm-sg-num">{{todayCount}}<text class="dm-sg-unit">场</text></view>
					<view class="dm-sg-lab">今日解锁</view>
				</view>
				<view class="dm-sg dm-sg-gold">
					<view class="dm-sg-num">{{todayCost}}<text class="dm-sg-unit">金币</text></view>
					<view class="dm-sg-lab">今日支出</view>
				</view>
				<view class="dm-sg">
					<view class="dm-sg-num">{{archivedCount}}<text class="dm-sg-unit">场</text></view>
					<view class="dm-sg-lab">已归档</view>
				</view>
			</view>

			<block v-if="todayList.length > 0">
				<view class="dm-sec">
					<view class="dm-sec-bar"></view>
					<view class="dm-sec-t">今日解锁</view>
					<view class="dm-sec-e">TODAY</view>
					<view class="dm-sec-r"><text class="dm-sec-r-b">{{todayCount}}</text> 场可回看</view>
				</view>
				<view class="dm-today-list">
					<view class="dm-m-card" v-for="(item, index) in todayList" :key="'t'+index" @click="toDetail(item.code,item.isToday)">
						<view class="dm-m-thumb">
							<image class="dm-m-thumb-img" v-if="item.goodsImg" :src="imagebaseurl+item.goodsImg" mode="aspectFill"></image>
						</view>
						<view class="dm-m-info">
							<view><text class="dm-lg-chip">今日可回看</text></view>
							<view class="dm-m-name">{{item.goodsName}}</view>
							<view class="dm-m-meta">
								<text class="dm-m-price"><text class="dm-m-price-b">{{item.price}}</text> 金币</text>
								<text class="dm-m-time">{{unlockTime(item)}}</text>
							</view>
						</view>
						<view class="dm-play"></view>
					</view>
				</view>
			</block>

			<block v-if="earlierList.length > 0">
				<view class="dm-sec">
					<view class="dm-sec-bar"></view>
					<view class="dm-sec-t">往日解锁</view>
					<view class="dm-sec-e">ARCHIVE</view>
					<view class="dm-sec-r">已归档 <text class="dm-sec-r-b">{{archivedCount}}</text> 场</view>
				</view>
				<view class="dm-arch-card">
					<view class="dm-arch-head">
						<view class="dm-arch-ico"></view>
						<view class="dm-arch-t">往日记录仅作留存</view>
						<view class="dm-arch-c">共 {{archivedCount}} 场</view>
					</view>
					<view class="dm-arch-row" v-for="(item, index) in earlierList" :key="'e'+index">
						<view class="dm-ar-thumb">
							<image class="dm-ar-thumb-img" v-if="item.goodsImg" :src="imagebaseurl+item.goodsImg" mode="aspectFill"></image>
						</view>
						<view class="dm-ar-info">
							<view class="dm-ar-name">{{item.goodsName}}</view>
							<view class="dm-ar-meta">
								<text class="dm-ar-price"><text class="dm-ar-price-b">{{item.price}}</text> 金币</text>
								<text class="dm-ar-time">{{archTime(item)}}</text>
							</view>
						</view>
						<view class="dm-ar-lock">已归档</view>
					</view>
				</view>
			</block>

			<view class="dm-tip">当日解锁的赛事当天可反复回看解析内容，判定结果以赛事官方为准</view>
		</block>
		<view class="dm-foot">QIUYU AI · UNLOCK HISTORY</view>
    </view>
</template>

<script>
// 解锁记录页（2026-09-18 v2重设计·张总批稿，与H5 chunk 909cfbd1 同款）
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
		todayCount() {
			return this.todayList.length;
		},
		archivedCount() {
			return this.earlierList.length;
		},
		todayCost() {
			let sum = this.todayList.reduce((acc, item) => acc + (parseFloat(item.price) || 0), 0);
			return Math.round(sum * 10) / 10;
		},
		todayCn() {
			let d = new Date();
			let wk = ['周日','周一','周二','周三','周四','周五','周六'];
			return (d.getMonth() + 1) + '月' + d.getDate() + '日 ' + wk[d.getDay()];
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
    onShow: function () {},
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
		goHome:function(){
			uni.switchTab({
				url:'/pages/match/index'
			});
		},
		unlockTime:function(item){
			let s = (item.createDate || '');
			return s.length >= 16 ? s.slice(11, 16) + ' 解锁' : '';
		},
		archTime:function(item){
			let s = (item.createDate || '');
			if (s.length >= 16) {
				let m = parseInt(s.slice(5, 7), 10);
				let d = parseInt(s.slice(8, 10), 10);
				return m + '月' + d + '日 ' + s.slice(11, 16);
			}
			return s;
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
