<template>
	<view class="goods-container" >
		
		<view class="question-content">
			<view class="question">
				<view class="question-title-left">
					<view class="icon-circle">
					    <uni-icons type="help" size="30" color="#0b9bde"></uni-icons>
					  </view>
				</view>
				<view style="flex: 2;margin: 0px 20rpx;">
					<h4>分析问题</h4>
					<view style="font-size: 24rpx;margin-top: 10rpx;color: #a19d9d;">解析结果由球域Ai生成，内容仅供参考，请仔细甄别。</view>
				</view>
				<view>
					<text class="game-cjhx-tag" v-if="gameInfo.remark"><uni-icons type="star-filled" size="13" color="#8f4300"></uni-icons>{{gameInfo.remark}}</text>
				</view>
			</view>
			
			<view class="game-item">
				<view class="game-item-title">
					<text class="game-league">{{gameInfo.leagueAbbName}}</text>
					<text style="font-size: 24rpx;color: #a19d9d;margin-left: 20rpx;">{{gameInfo.businessDate}}</text>
					<text class="game-item-title-right">
						<text class="game-result-tag game-result-success" v-if="gameInfo.result == '1'"><uni-icons type="checkmarkempty" size="13" color="#fff"></uni-icons>正确</text>
						<text class="game-result-tag game-result-error" v-if="gameInfo.result == '0'"><uni-icons type="closeempty" size="13" color="#fff"></uni-icons>错误</text>
						<text class="game-result-tag game-result-he" v-if="gameInfo.result == '2'"><uni-icons type="tune" size="15" color="#fff"></uni-icons>和</text>
					</text>
				</view>
				<view class="game-item-content">
					<view class="game-team">{{gameInfo.homeTeamAllName}}</view>
					<view class="game-vs">
						<text class="game-item-vs">VS</text>
						<view style="color: #9aa1b5;font-size: 24rpx;margin-top: 30rpx;">{{ gameInfo.matchTime }}</view>
					</view>
					<view class="game-team">{{gameInfo.awayTeamAllName}}</view>
				</view>
			</view>
			
			<view class="game-result" v-if="gameInfo && gameInfo.isUnlock">
				<view style="flex: 2;">
					<text style="color: #8f4300;">球域Ai主推方案</text>
					<view class="rich-text raw-text-container" v-html="processedHtmlContent"></view>
				</view>
				<view style="flex: 1;text-align: right;">
					<text class="game-cjhx-tag" v-if="gameInfo.remark" style="border-radius: 30rpx;border: 1px solid #fbc032;"><uni-icons type="star-filled" size="15" color="#8f4300" ></uni-icons>{{gameInfo.remark}}</text>
				</view>
			</view>
			
			<view class="game-lock-content" v-if="gameInfo && !gameInfo.isUnlock">
				<view class="icon-circle-lock">
				    <text><uni-icons type="locked" size="40" color="#fff"></uni-icons></text>
				  </view>
				<view style="font-weight: bolder;font-size: 34rpx;">预测结果已锁定</view>
				<view style="color: #9aa1b5;margin: 30rpx 30rpx;font-size: 26rpx;">解锁查看AI完整分析报告</view>
				
			</view>
			
			<view class="lock-btn" @click="unlock" v-if="gameInfo && !gameInfo.isUnlock">
				 <uni-icons type="locked" size="26" color="#fff" style="vertical-align: bottom;margin-right: 10rpx;"></uni-icons>
				 <text>立即解锁查看</text>
			</view>
			<view class="lock-btn-text" v-if="gameInfo && !gameInfo.isUnlock">
				<text><uni-icons type="checkbox" size="16" color="#0c9f71" class="lock-text-icon"></uni-icons>安全支付</text>
				<text style="margin: 0px 40rpx"><uni-icons type="checkbox" size="16" color="#0c9f71" class="lock-text-icon"></uni-icons>秒级解锁</text>
				<text><uni-icons type="checkbox" size="16" color="#0c9f71" class="lock-text-icon"></uni-icons>准确保障</text>
			</view>
		</view>
		<view style="text-align: center;" v-if="gameInfo && gameInfo.isUnlock">
			<text class="lock-jsrs"><uni-icons type="checkbox" size="18" color="#0b9bde" style="vertical-align: bottom;margin-right: 15rpx;"></uni-icons>
				<text>已有<text class="mount-family">{{ viewCount }}</text>人解锁该场次</text>
			</text>
		</view>
		<view class="question-bottom">
			<view>
				<text class="question-bottom-top"><image src="/static/icon/ai.png" style="width: 22px;height: 22px;vertical-align: text-bottom;margin-right: 10rpx;"></image>球域Ai智能预测</text>
			</view>
			<view class="question-bottom-text">基于深度学习算法 | 实时数据更新</view>
		</view>
		
		<uni-popup ref="noticePopup" class="notice-content" background-color="#ddd" type="center" v-if="gameInfo">
			<view class="notice-popup-content">
				
				<view style="text-align: center;">
					<text style="font-size: 36rpx;font-weight: bolder;">友情提醒</text>
				</view>
				<view class="pay-notice-content">
					<text>您将花费</text>
					<text class="mount-family" :style="gameInfo.price != gameInfo.discountPrice ? 'text-decoration: line-through;color: #a49f9f' : ''">{{gameInfo.price || 0}}</text>
					<text class="mount-family" v-if="gameInfo.price != gameInfo.discountPrice">{{gameInfo.discountPrice || 0}}</text>
					<text>元，解锁</text>
					<text class="mount-family" style="margin-left: 6rpx;margin-right: 6rpx;">{{gameInfo.matchDate}}</text>
					<text>日的本场比赛分析!</text>
				</view>
				<view class="notice-option">
					<view class="notice-option-item" @tap="cancelNotice" style="background-color: #f4f4f4;color: #000;">取消</view>
					<view class="notice-option-item" @tap="payNotice" style="background-color: #2864f8;">支付</view>
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
				gameInfo:'',
				htmlContent:'',
				payTypeId: 4,
				isLogin:false,
				isPay:false,
				viewCount: 0 // 浏览数
			}
		},
		onUnload() {
		    // 存储标识：表示从A页面返回列表页
			uni.setStorageSync('game_fromPage', 'A');
		},
		onLoad:function(options) {
			if(options.token) {
			  uni.setStorageSync("wanju_token", options.token);
			}
			if (uni.getStorageSync('wanju_token') != '') {
				let that = this
				that.ajax(that.url.matchsDetail+ "/" + options.id, "GET", null, function(resp) {
					that.gameInfo = resp.data
					that.htmlContent = resp.data.content;
					that.getLocalViewCount();
				})
			}
			
		},
		computed: {
		    processedHtmlContent() {
				const content = this.htmlContent || '';
		      // 将 **内容** 替换为 <strong>内容</strong>
		      return content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
		    }
		  },
		onShow:function(){
			
		},
		methods: {
			getLocalViewCount() {
			  let count = uni.getStorageSync(`gameai_event_view_${this.gameInfo.id}`);
			  if (!count) {
				count = Math.floor(Math.random() * 1301) + 200;
				uni.setStorageSync(`gameai_event_view_${this.gameInfo.id}`, count);
			  }
			  this.viewCount = count;
			},
			payNotice(){
				let that = this
				that.ajax(that.url.orderCreate, "post", {goodsId: that.gameInfo.id, type: that.payTypeId}, function(resp) {
					that.payOrderId = resp.data.payOrderId;
					that.payAmount = resp.data.payAmount;
					that.payTypeId = resp.data.payType
					that.$refs.noticePopup.close()
					that.isPay = true;
					
				});
			},
			unlock:function() {
				let that = this
				if (that.gameInfo.price > 0) {
					if (that.gameInfo.isUnlock == false) {
						that.ajax(that.url.matchsVerifyUnlock+ "/" + that.gameInfo.id, "GET", null, function(resp) {
							if (typeof resp.data === 'number') {
								uni.showModal({
									title: '友情提醒',
									content: '您今日剩余免费解锁次数' + resp.data + '次' ,
									confirmText: '免费解锁',
									cancelText: '取消',
									success: (res) => {
									  if (res.confirm) {
										that.ajax(that.url.orderCreate, "post", {goodsId: that.gameInfo.id, type: that.payTypeId, mark: 1}, function(result) {
											that.ajax(that.url.matchsDetail+ "/" + that.gameInfo.id, "GET", null, function(oresp) {
												that.gameInfo = oresp.data
												that.htmlContent = oresp.data.content;
											})
											uni.setStorageSync('gameai_unlock_id', that.gameInfo.id);
										})
									  } else if (res.cancel) {
										// 点击「取消」按钮执行的逻辑（可选）
										console.log('用户点击了取消');
									  }
									}
								  });
							} else {
								if (resp.data) {
									
									that.markIndex = that.gameInfo.id
									that.$refs.noticePopup.open()
								} else {
									uni.showToast({icon: 'none',title: '赛事正在解析中，请稍后再解锁'});
								}
							}
						})
						return
					}
				}
			},
			cancelNotice(){
				this.$refs.noticePopup.close()
			},
			closePay: function() {
				this.isPay = false;
			},
			okPay: function() {
				this.isPay = false;
				let that = this
				uni.setStorageSync('gameai_unlock_id', that.gameInfo.id);
				this.viewCount += 1;
				// 更新本地存储（永久保存）
				uni.setStorageSync(`gameai_event_view_${this.gameInfo.id}`, this.viewCount);
				that.ajax(that.url.matchsDetail+ "/" + that.gameInfo.id, "GET", null, function(oresp) {
					that.gameInfo = oresp.data
					that.htmlContent = oresp.data.content;
				})
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
page {
  // background-image: url(/static/jiexi_bg.jpg);
  background-color: #e7e9f0;
  background-size: 100% auto;
  background-repeat: no-repeat;
  background-position: top center;
  min-height: 100vh;
}
.raw-text-container {
  /* 关键样式：保留所有空格和换行 */
  white-space: pre-wrap;
  
  /* 可选样式：增强可读性 */
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 38rpx;
  line-height: 1.8;
  margin-top: 40rpx;
  font-weight: bolder;
  border-radius: 8px;
  
  // border-left: 3px solid #3498db;
}
.question-content{
	padding: 30rpx;
}
.question-title{
	display: flex;
	align-items: center;
}
.question {
	font-size: 36rpx;
	padding: 30rpx;
	background-color: #fff;
	border-radius: 12px;
	margin-top: 20rpx;
	border: 1px solid #0b9bde;
	border-left: 5px solid #0b9bde;
	font-weight: 700;
	// box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.1);
	display: flex;
	gap: 20;
}


/* 图标容器 - 圆形背景 */
.icon-circle {
  width: 40rpx;    /* 圆的直径（比图标大一点） */
  height: 40rpx;
  border-radius: 50%;  /* 圆形关键 */
  background-color: #e6f2ff;  /* 浅蓝背景（搭配 #0b9bde 图标） */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 25rpx;
}
.question view{
}
.game-item{
	background-color: #fff;
	padding: 30rpx;
	margin-bottom: 40rpx;
	border-radius: 30rpx;
	border: 4rpx solid #0b9bde;
	margin-top: 40rpx;
}
.game-league{
	font-size: 22rpx;
	background-color: #e0f2fa;
	width: 100rpx;
	color: #0b9bde;
	padding: 10rpx 20rpx;
	text-align: center;
	border-radius: 10rpx;
	border: 1px solid #9fc3d8;
}
.game-cjhx-tag{
	font-size: 26rpx;
	background-color: #feedaf;
	border: 1px solid #8f4300;
	width: 100rpx;
	color: #8f4300;
	padding: 12rpx 20rpx;
	text-align: center;
	border-radius: 20rpx;
}

.game-item-title-right{
	float: right;
}
.game-item-title-right text{
	margin-left: 5px;
}
.game-team{
	font-size: 32rpx;
	font-weight: bolder;
	image{
		width: 50rpx;
		height: 50rpx;
	}
}
.game-item-vs{
	background-color: #f2f4fa;
	padding: 20rpx;
	border: 1px solid #e4e9f0;
	color: #9aa1b5;
	border-radius: 50%;
}
.game-vs{
	font-size: 30rpx;
	font-weight: bolder;
}
.game-item-content{
	display: flex;
	text-align: center;
	font-size: 30rpx;
	margin-top: 10rpx;
	padding: 40rpx 20rpx;
	// border-bottom: 1px solid #f4f6fc;
}
.game-item-content view{
	flex: 1;
}
.game-result-tag{
	font-size: 22rpx;
	width: 100rpx;
	color: #fff;
	padding: 10rpx 20rpx;
	text-align: center;
	border-radius: 30rpx;
}
.game-result-success{
	background-color: #10a977;
}
.game-result-error{
	background-color: #e93634;
}
.game-result-he{
	background-color: #f2f4fa;
}
.game-result{
	background-color: #fdeeb1;
	border: 4rpx solid #fbc032;
	border-radius: 30rpx;
	padding: 40rpx;
	display: flex;
}

.question-bottom{
	text-align: center;
	margin-top: 60rpx;
}
.question-bottom-top{
	background-color: #f2f4fa;
	padding: 20rpx 40rpx;
	border-radius: 40rpx;
	font-weight: bolder;
}
.question-bottom-text{
	color: #a19d9d;
	font-size: 24rpx;
	margin-top: 40rpx;
}
.game-lock-content{
	background-color: #fff;
	padding: 40rpx;
	border: 4rpx solid #eeede9;
	border-radius: 30rpx;
	box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.15);
	text-align: center;
	justify-content: center;
	align-items: center;
}
.icon-circle-lock{
	width: 80rpx;    /* 圆的直径（比图标大一点） */
	height: 80rpx;
	border-radius: 50%;  /* 圆形关键 */
	background-color: #e85099;  /* 浅蓝背景（搭配 #0b9bde 图标） */
	justify-content: center;
	padding: 25rpx;
	display: inline-block;
	margin-bottom: 30rpx;
}
.lock-btn{
	background-color: #e85099;
	border-radius: 20rpx;
	margin-top: 50rpx;
	text-align: center;
	padding: 25rpx;
	color: #fff;
	font-size: 32rpx;
	font-weight: bolder;
}
.lock-btn-text{
	text-align: center;
	font-size: 20rpx;
	color: #9aa1b5;
	margin-top: 30rpx;
}
.lock-text-icon{
	vertical-align: bottom;
	margin-right: 5rpx;
}
.lock-jsrs{
	background-color: #e2f3fc;
	color: #0b9bde;
	border-radius: 30rpx;
	padding: 10rpx 20rpx;
	font-size: 24rpx;
}
.notice-popup-content{
	padding: 40rpx;
	width: 300px;
	height: 170px;
	border-radius: 20rpx;
	background-color: white;
}
.pay-notice-content{
	padding: 30rpx;
	text-align: center;
}
.notice-option{
	display: flex;
	gap: 40rpx;
}
.notice-option-item{
	flex: 1;
	border-radius: 40rpx;
	color: white;
	padding: 20rpx;
	font-size: 30rpx;
	text-align: center;
	margin-top: 40rpx;
}
// .goods-container{
// 	background-color: #e3eff9;
// }
// page {
//   background-color: #e3eff9;
// }
</style>
