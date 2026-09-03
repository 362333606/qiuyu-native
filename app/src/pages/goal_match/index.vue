<template>
	<view class="page">
		<uni-notice-bar v-if="noticeDetail" show-icon scrollable color="#fff" background-color="red" style="margin-bottom: 0px;"
			:text="noticeDetail" />
		<view class="date-scroll-container">
			<view class="date-list">
				<text class="date-item" :class="dateIndex == item.id ? 'date-active' : ''" @click="handleSelect(item)" v-for="(item, index) in dateList" :key="index">
					{{item.title}}
				</text>
			</view>
		</view>
		<view class="menu-content">
			<view class="cate-list">
				<view class="cate-item" @tap="cateSelect(item.value)" :class="cateIndex === item.value ? 'cate-item-active' : ''"
				    v-for="(item, index) in cateList" :key="index">{{ item.name }}</view>
			</view>
		</view>
		<view class="game-total">
			<view>今日共有{{total}}场预测</view>
		</view>
		<view class="game-content">
			<view class="game-item" v-for="(item, index) in orderList" :key="index">
				<view class="game-item-title">
					<text class="game-league" :style="{ backgroundColor: `#${item.backColor}` }">{{item.leagueAbbName}}</text>
					<text class="game-info" v-if="item.price > 0">球域Ai精选解析</text>
					<text class="game-info" v-else>球域Ai解析</text>
					<text style="color: red;font-size: 16px;float: right;margin-right: 4px;">{{item.remark}}</text>
				</view>
				<view class="game-item-content">
					<view class="game-team">
						<!-- <image src="/static/team.png"></image> -->
						<view>{{item.homeTeamAllName}}</view>
					</view>
					<view class="game-time">
						<view v-if="item.result == '1'" style="color: #ff5722;">正确</view>
						<view v-if="item.result == '0'" style="color: #c2c2c2;">错误</view>
						<view v-if="item.result == '2'" style="color: #ffb800;">和</view>
						<view class="game-vs">VS</view>
						<view class="game-date">{{item.matchDate}} {{item.matchTime}}</view>
					</view>
					<view class="game-team">
						<!-- <image src="/static/team.png"></image> -->
						<view>{{item.awayTeamAllName}}</view>
					</view>
					<view class="game-option" @tap="toDetail(item)" style="width: 16%;">
						<!-- <text class="game-fx"> </text> -->
						<view class="game-btn mount-family" style="background-color: red;color: white;" v-if="item.price > 0">
							<text v-if="item.isUnlock">查看</text>
							<text v-else>解锁</text>
						</view>
						<view class="game-btn mount-family" v-else>免费查看</view>
					</view>
				</view>
			</view>
		
		</view>
		
		<uni-popup ref="noticePopup" class="notice-content" background-color="#fff" type="center">
			<view class="notice-popup-content">
				
				<view style="text-align: center;">
					<text style="font-size: 36rpx;font-weight: bolder;">友情提醒</text>
				</view>
				<view class="pay-notice-content">
					<text>您将花费</text>
					<text class="mount-family">{{payGameItem.price || 0}}</text>
					<text>元，解锁</text>
					<text class="mount-family" style="margin-left: 6rpx;margin-right: 6rpx;">{{nowYear}}-{{nowDate}} </text>
					<text>日的本场比赛分析!</text>
				</view>
				<view class="notice-option">
					<view class="notice-option-item" @tap="cancelNotice" style="background-color: #f4f4f4;color: #000;">取消</view>
					<view class="notice-option-item" @tap="payNotice" style="background-color: #44c9e8;">支付</view>
				</view>
				
			</view>
		</uni-popup>
		
		<view class="show-popup" v-if="isPay">
			<view class="popup-mask" @click="closePay"></view>
			<view class="popup-contents">
				<payment @toCancel="closePay" @okPay="okPay" :markIndex="markIndex" :payTypeId="5" :payOrderId="payOrderId" :payAmount="payAmount"></payment>
			</view>
		</view>
	</view>
</template>

<script>
	import payment from '@/components/payment';
	export default {
		components: {
			payment
		},
		data() {
			return {
				dateIndex: '',
				cateIndex : '',
				dateList: [],
				page: 1,
				pageSize: 10,
				totalPages:0,
				isLastPage:false,
				orderList:[],
				nowDate:'',
				nowYear:'',
				total:0,
				isPay:false,
				payOrderId:0,
				payAmount:0,
				payGameItem:'',
				isLogin:false,
				noticeDetail:'',
				cateList: [
				  { name: '全部', value: '' }
				]
			}
		},
		onLoad:function() {
			let that = this
			this.ajax(this.url.getData, "GET", {name: 'Match_Type'}, function(resp) {
				const newItems = Object.entries(resp.data).map(([key, value]) => ({
					name: value,
					value: key
				}));
				// 合并初始数据和新数据
				that.cateList = [
					...that.cateList,  // 保留"全部"选项
					...newItems        // 添加转换后的新选项
				]
			})
			this.generateDateList();
			this.getNoticeList();
			// 确保 DOM 完全渲染后，再执行滚动逻辑
			// 页面加载后，自动选中最新日期（数组最后一项，对应最右边）
			// this.$nextTick(() => {
			// 	if (this.dateList.length) {
			// 	  this.dateIndex = this.dateList.at(-1).id;
			// 	  this.nowDate = this.dateList.at(-1).title;
			// 	  this.scrollToRight(); // 在 $nextTick 回调中调用滚动方法
			// 	  this.getList();
			// 	}
			// });
			
		},
		
		onShow:function(){
			if (uni.getStorageSync('wanju_token')) {
				this.isLogin = true;
			}
			this.$nextTick(() => {
				if (this.dateList.length) {
				  this.dateIndex = this.dateList.at(-1).id;
				  this.nowDate = this.dateList.at(-1).title;
				  this.scrollToRight(); // 在 $nextTick 回调中调用滚动方法
				  this.getList();
				}
			});
			this.page = 1;
		},
		onReachBottom: function () {
			console.info(111)
			let that = this
			if (that.isLastPage) return
			that.page = that.page + 1
			that.getList();
		},
		methods: {
			getNoticeList(){
				let that = this
				that.ajax(that.url.noticeList, "GET", {type: 2}, function(resp) {
					 if (resp.data.length > 0) {
						 that.noticeDetail = resp.data[0].content.replace(/<[^>]+>/g, "");
					 }
				})
			},
			payNotice(){
				let that = this
				that.ajax(that.url.orderCreate, "post", {goodsId: that.payGameItem.id, type: 5}, function(resp) {
					that.payOrderId = resp.data.payOrderId;
					that.payAmount = resp.data.payAmount;
					that.payTypeId = resp.data.payType
					that.$refs.noticePopup.close()
					that.isPay = true;
					
				});
			},
			cancelNotice(){
				this.$refs.noticePopup.close()
			},
			toDetail:function(item){
				if (!this.isLogin) {
					uni.showToast({icon: 'none',title: '请登录后再操作'});
					return;
				}
				if (item.price > 0) {
					if (item.isUnlock == false) {
						this.payGameItem = item
						this.markIndex = item.id
						this.$refs.noticePopup.open()
						return
					}
				}
				uni.navigateTo({
					url:'/pages/goal_match/detail?id='+item.id
				})
			},
			
			getList() {
				let ref = this
				let data = {
					page:ref.page,
					pageSize:ref.pageSize,
					time: ref.nowYear + '-' + ref.nowDate,
					type: ref.cateIndex
				}
				ref.ajax(ref.url.goalMatchsList, "GET", data, function(resp) {
					let result = resp.data.content
					ref.total = resp.data.totalElements;
					if (result == null || result.length == 0){
						ref.isLastPage = true
						ref.page = ref.page - 1
					}else{
						if (ref.page == 1) ref.orderList = []
						ref.orderList = ref.orderList.concat(result)
						if (ref.page > 1){
							// uni.showToast({
							// 	icon:'none',
							// 	title:"又加载了" + result.length + "个项目"
							// })
						}
					}
				})
			},
			generateDateList() {
			  const today = new Date();
			  this.nowYear = today.getFullYear();
			  const list = [];
			  for (let i = 2; i >= 0; i--) {
				  const currentDate = new Date(today);
				  currentDate.setDate(today.getDate() - i);
				  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
				  const day = String(currentDate.getDate()).padStart(2, '0');
				  const dateStr = `${month}-${day}`;
				  list.push({ id: dateStr, title: dateStr });
				}
			  this.dateList = list;
			},
			// 可选：自动滚动到最右边（确保最新日期默认可见）
			scrollToRight() {
			  const scrollContainer = document.querySelector('.date-scroll-container');
			  // 滚动到容器最右侧（scrollLeft = 最大滚动距离）
			  scrollContainer.scrollLeft = scrollContainer.scrollWidth;
			},
			cateSelect(i){
				this.cateIndex = i;
				this.page = 1;
				this.isLastPage = false;
				this.orderList = []
				this.getList();
			},
			handleSelect(item) {
			  this.dateIndex = item.id;
			  this.nowDate = item.title;
			  this.page = 1;
			  this.isLastPage = false;
			  this.orderList = []
			  this.getList();
			},
			test(){
				uni.showToast({icon: 'none',title: '正在建设中...'});
			},
			closePay: function() {
				this.isPay = false;
			},
			okPay: function() {
				this.isPay = false;
				// uni.showLoading();
				// this.page = 1;
				// this.orderList = []
				uni.navigateTo({
					url: '/pages/goal_match/detail?id=' + this.markIndex
				})
				// this.getList();
			},
			toPage:function(name,url){
				uni.navigateTo({
					url:url
				})
			}
		}
	}
</script>

<style lang="less">
	@import url("index.less");
</style>
