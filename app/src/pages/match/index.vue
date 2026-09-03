<template>
	<view class="page">
		<uni-notice-bar v-if="noticeDetail" show-icon scrollable color="#77858e" background-color="white" style="margin-bottom: 0px;"
			:text="noticeDetail" />
			
			
		<view class="top-content">
			<view class="top-content-left">
				<image src="/static/logo.jpg" style="width: 80rpx;height: 80rpx;border-radius: 20rpx;"></image>
				<view>
					<h3>球域Ai预测</h3>
					<text style="font-size: 24rpx;color: #aeaeae;">智能数据分析平台</text>
				</view>
			</view>
			<view style="text-align: right;" v-if="rate > 0">
			<!-- 	<text>预测率</text>
				<view class="mount-family">{{ rate }}%</view> -->
				
				  <view class="circle-progress">
				    <!-- 底层灰色圆环 -->
				    <view class="circle-bg"></view>
				    <!-- 左侧进度圆环 -->
				    <view class="circle-left" :style="leftStyle"></view>
				    <!-- 右侧进度圆环 -->
				    <view class="circle-right" :style="rightStyle"></view>
				    <!-- 中间文字 -->
				    <!-- <view class="progress-text mount-family">{{ Number(rate).toFixed(1) }}%</view> -->
					
					<view class="progress-text">
						<text>{{ Number(rate).toFixed(1) }}%</text>
						<text style="font-size: 16rpx;color: #989ea5;">预测率</text>
					</view>
				  </view>
			</view>
		</view>
		<view class="date-scroll-container">
			<view class="date-list">
				<view class="date-item" :class="dateIndex == item.id ? 'date-active' : ''" @click="handleSelect(item)" v-for="(item, index) in dateList" :key="index">
					<view class="date-item-week" :class="dateIndex == item.id ? 'date-week-active' : 'date-week-noactive'">{{item.week}}</view>
					<view>{{item.title}}</view>
				</view>
			</view>
		</view>
		<view class="menu-content">
			<!-- <view class="menu-option"></view> -->
			<view class="cate-list">
				<view class="cate-item" @tap="cateSelect(item.value)" :class="cateIndex === item.value ? 'cate-item-active' : ''"
				    v-for="(item, index) in cateList" :key="index">{{ item.name }}</view>
				<view class="cate-item" :class="cateIndex === 999 ? 'cate-item-active' : ''" @tap="cateSelect(999)" style="background-color: #fffbea;color: #a68247;">
					<uni-icons type="star-filled" size="20" color="#a68247"></uni-icons>
					<text>超级精选</text>
				</view>
			</view>
			<!-- <view class="menu-option">进球数预测</view> -->
		</view>
		<view class="game-total">
			<!-- <view style="text-align: left;color: red;font-weight: bolder;"><span v-if="rate">预测率：{{ rate }}%</span></view> -->
			<!-- <view class="menu-option all-pay">一键全开</view> -->
			<view style="text-align: left;">今日共有<text class="game-total-num">{{total}}</text>场预测</view>
			<view>
				<text class="game-total-text"><i class="game-total-text-point"></i>实时更新</text>
			</view>
		</view>
		<view class="game-content">
			<view class="game-item" v-for="(item, index) in orderList" :key="index">
				<view class="game-item-title">
					<text class="game-league">{{item.leagueAbbName}}</text>
					<text class="game-item-title-right">
						<text class="game-info" v-if="!item.result">AI解析</text>
						<text class="game-cjhx-tag" v-if="item.remark"><uni-icons type="star-filled" size="13" color="#fff"></uni-icons>{{item.remark}}</text>
						<text class="game-result-tag game-result-success" v-if="item.result == '1'"><uni-icons type="checkmarkempty" size="13" color="#fff"></uni-icons>正确</text>
						<text class="game-result-tag game-result-error" v-if="item.result == '0'"><uni-icons type="closeempty" size="13" color="#fff"></uni-icons>错误</text>
						<text class="game-result-tag game-result-he" v-if="item.result == '2'"><uni-icons type="tune" size="13" color="#fff"></uni-icons>和</text>
					</text>
				</view>
				<view class="game-item-content">
					<view class="game-team">{{item.homeTeamAllName}}</view>
					<view class="game-vs"><text class="game-item-vs">VS</text></view>
					<view class="game-team">{{item.awayTeamAllName}}</view>
				</view>
				<view class="game-item-bottom">
					<view class="game-date"><image src="/static/icon/time.png"></image>{{ item.matchDate.substring(5) }} {{item.matchTime}}</view>
					<view class="game-option" @tap="toDetail(item)">
						<view class="game-btn mount-family" v-if="item.price > 0" style="background-color: #e85099;">
							<text v-if="item.isUnlock">查看<uni-icons type="forward" size="18" color="#fff" style="margin-left: 2px;"></uni-icons></text>
							<text v-else><uni-icons type="locked-filled" size="18" color="#fff" style="margin-right: 2px;"></uni-icons>解锁</text>
						</view>
						<view class="game-btn mount-family" style="background-color: #0b9bde;" v-else>查看<uni-icons type="forward" size="18" color="#fff" style="margin-left: 2px;"></uni-icons></view>
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
					<text class="mount-family" :style="payGameItem.price != payGameItem.discountPrice ? 'text-decoration: line-through;color: #a49f9f' : ''">{{payGameItem.price || 0}}</text>
					<text class="mount-family" v-if="payGameItem.price != payGameItem.discountPrice">{{payGameItem.discountPrice || 0}}</text>
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
				<payment @toCancel="closePay" @okPay="okPay" :markIndex="markIndex" :payTypeId="payTypeId" :payOrderId="payOrderId" :payAmount="payAmount"></payment>
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
				rate:'',
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
				payTypeId: 4,
				cateList: [
				  { name: '全部', value: '' }
				]
			}
		},
		computed: {
		    // 右侧旋转角度
		    rightStyle() {
		      let deg = 0;
		      if (this.rate >= 50) {
		        deg = 180;
		      } else {
		        deg = (this.rate / 50) * 180;
		      }
		      return { transform: `rotate(${deg}deg)` };
		    },
		    // 左侧旋转角度
		    leftStyle() {
		      let deg = 0;
		      if (this.rate > 50) {
		        deg = ((this.rate - 50) / 50) * 180;
		      }
		      return { transform: `rotate(${deg}deg)` };
		    },
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
			
			const fromPage = uni.getStorageSync('game_fromPage');
			const unlockId = uni.getStorageSync('gameai_unlock_id')
			console.info(unlockId)
			if (unlockId) {
				this.orderList.forEach(item => {
				  if (item.id == unlockId) {
					item.isUnlock = true
				  }
				})
				// 用完清掉
				uni.removeStorageSync('gameai_unlock_id')
			}
			if (fromPage !== 'A') {
				
				this.$nextTick(() => {
					uni.pageScrollTo({
						scrollTop: 0, // 滚动到顶部
						duration: 150 // 可选：滚动动画时长（毫秒）
					  });
					if (this.dateList.length) {
					  this.dateIndex = this.dateList.at(-1).id;
					  this.nowDate = this.dateList.at(-1).title;
					  this.scrollToRight(); // 在 $nextTick 回调中调用滚动方法
					  this.page = 1;
					  this.getList();
					}
				});
			}
			uni.removeStorageSync('game_fromPage');
		},
		onReachBottom: function () {
			console.info(111)
			let that = this
			if (that.isLastPage) return
			that.page = that.page + 1
			that.getList();
		},
		methods: {
			toGoalMatch() {
				uni.navigateTo({
					url:'/pages/goal_match/index'
				})
			},
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
				// if (that.cateIndex === 999) {
				// 	that.payTypeId = 5
				// }
				that.ajax(that.url.orderCreate, "post", {goodsId: that.payGameItem.id, type: that.payTypeId}, function(resp) {
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
				let that = this
				if (!this.isLogin) {
					uni.showToast({icon: 'none',title: '请登录后再操作'});
					return;
				}
				// if (item.price > 0) {
				// 	if (item.isUnlock == false) {
				// 		that.ajax(that.url.matchsVerifyUnlock+ "/" + item.id, "GET", null, function(resp) {
				// 			if (typeof resp.data === 'number') {
				// 				uni.showModal({
				// 					title: '友情提醒',
				// 					content: '您今日剩余免费解锁次数' + resp.data + '次' ,
				// 					confirmText: '免费解锁',
				// 					cancelText: '取消',
				// 					success: (res) => {
				// 					  if (res.confirm) {
				// 						that.ajax(that.url.orderCreate, "post", {goodsId: item.id, type: that.payTypeId, mark: 1}, function(resp) {
				// 							uni.navigateTo({
				// 								url: '/pages/match/detail?id=' + item.id
				// 							})
				// 							if (that.orderList.length > 0) {
				// 								const targetItem = that.orderList.find(o => o.id === item.id);
				// 								if (targetItem) {
				// 									targetItem.isUnlock = true;
				// 								}
				// 							}
				// 						})
				// 					  } else if (res.cancel) {
				// 						// 点击「取消」按钮执行的逻辑（可选）
				// 						console.log('用户点击了取消');
				// 					  }
				// 					}
				// 				  });
				// 			} else {
				// 				if (resp.data) {
				// 					that.payGameItem = item
				// 					that.markIndex = item.id
				// 					that.$refs.noticePopup.open()
				// 				} else {
				// 					uni.showToast({icon: 'none',title: '赛事正在解析中，请稍后再解锁'});
				// 				}
				// 			}
				// 		})
				// 		return
				// 	}
				// }
				uni.navigateTo({
					url:'/pages/match/detail?form=detail&id='+item.id
				})
			},
			
			getList() {
				let ref = this
				let data = {
					page:ref.page,
					pageSize:ref.pageSize,
					time: ref.nowYear + '-' + ref.nowDate,
				}
				let getUrl = ref.url.matchsList
				if (ref.cateIndex === 999) {
					data.remark = '超级精选'
				} else {
					data.type = ref.cateIndex
				}
				ref.ajax(getUrl, "GET", data, function(resp) {
					let result = resp.data.list.content
					ref.total = resp.data.list.totalElements;
					ref.rate = resp.data.rate
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
			// generateDateList() {
			//   const today = new Date();
			//   this.nowYear = today.getFullYear();
			//   const list = [];
			//    // 定义中文星期数组
			// 	const weekArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
			//   for (let i = 2; i >= 0; i--) {
			// 	  const currentDate = new Date(today);
			// 	  currentDate.setDate(today.getDate() - i);
			// 	  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
			// 	  const day = String(currentDate.getDate()).padStart(2, '0');
			// 	  const dateStr = `${month}-${day}`;
			// 	  const week =  i === 0 ? '今天' : weekArr[currentDate.getDay()];
			// 	  list.push({ id: dateStr, title: dateStr, week: week });
			// 	}
			//   this.dateList = list;
			// },
			generateDateList() {
			  const now = new Date();
			  this.nowYear = now.getFullYear();
			  const list = [];
			  const weekArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
			  // 核心：判断当前时间是否 >= 早上10点
			  const currentHour = now.getHours();
			  // 10点之前，把“今天”算作昨天，10点之后才算今天
			  const realToday = currentHour >= 10 ? new Date(now) : new Date(now.setDate(now.getDate() - 1));
			  // 循环生成 今天、昨天、前天（共3天）
			  for (let i = 2; i >= 0; i--) {
			    const currentDate = new Date(realToday);
			    currentDate.setDate(realToday.getDate() - i);
			    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
			    const day = String(currentDate.getDate()).padStart(2, '0');
			    const dateStr = `${month}-${day}`;
			    const week =  i === 0 ? '今天' : weekArr[currentDate.getDay()];
			    list.push({ id: dateStr, title: dateStr, week: week });
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
					url: '/pages/match/detail?id=' + this.markIndex
				})
				if (this.orderList.length > 0) {
					const targetItem = this.orderList.find(item => item.id === this.markIndex);
					if (targetItem) {
						targetItem.isUnlock = true;
					}
				}
				
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
