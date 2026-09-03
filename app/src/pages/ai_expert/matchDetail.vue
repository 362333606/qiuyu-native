<template>
	<view class="goods-container" style="padding: 30rpx;">
		
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
		
		<view class="game-result">
			<view style="flex: 2;">
				<text style="color: #8f4300;">球域Ai主推方案</text>
				<view class="rich-text raw-text-container" v-html="processedHtmlContent"></view>
			</view>
			<view style="flex: 1;text-align: right;">
				<text class="game-cjhx-tag" v-if="gameInfo.remark" style="border-radius: 30rpx;border: 1px solid #fbc032;"><uni-icons type="star-filled" size="15" color="#8f4300" ></uni-icons>{{gameInfo.remark}}</text>
			</view>
		</view>
		
		<view class="question-bottom">
			<view>
				<text class="question-bottom-top"><image src="/static/icon/ai.png" style="width: 22px;height: 22px;vertical-align: text-bottom;margin-right: 10rpx;"></image>球域Ai智能预测</text>
			</view>
			<view class="question-bottom-text">基于深度学习算法 | 实时数据更新</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				gameInfo:'',
				htmlContent:''
			}
		},
		onLoad:function(options) {
			if (uni.getStorageSync('wanju_token') != '') {
				let that = this
				that.ajax(that.url.expertMatchsDetail+"/" + options.id, "GET", null, function(resp) {
					that.gameInfo = resp.data
					that.htmlContent = resp.data.content;
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
  font-size: 18px;
  line-height: 1.8;
  padding: 12px;
  
  border-radius: 8px;
  
  // border-left: 3px solid #3498db;
}

.question-title{
	display: flex;
	align-items: center;
}
.question {
	font-size: 36rpx;
	background-color: #fff;
	border-radius: 12px;
	margin-top: 20rpx;
	border: 1px solid #0b9bde;
	border-left: 5px solid #0b9bde;
	font-weight: 700;
	// box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.1);
	display: flex;
	gap: 20;
	padding: 30rpx;
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
</style>
