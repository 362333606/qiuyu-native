<template>
	<view class="goods-container" >
		
		<view class="question-content">
			<view class="question-title">
				<uni-icons type="help-filled" size="30" color="#FF4B2B"></uni-icons> 
				<h3 style="margin-left: 10rpx;color: #1a2a6c;">分析问题</h3>
			</view>
			<view style="font-size: 28rpx;">解析结果由球域Ai生成，内容仅供参考，请仔细甄别。</view>
			<view class="question">
				<view>{{gameInfo.matchDate}} {{gameInfo.leagueAllName}}</view>
				<view>{{gameInfo.homeTeamAllName}} VS {{gameInfo.awayTeamAllName}}</view>
			</view>
		</view>
		
		<view class="rich-text raw-text-container" v-html="processedHtmlContent" style="padding: 20rpx;"></view>
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
				that.ajax(that.url.goalMatchsDetail+"/" + options.id, "GET", null, function(resp) {
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
  background-image: url(/static/jiexi_bg.jpg);
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
.question-content{
	padding: 30rpx;
	border-bottom: 2px dashed #e0e0e0;
}
.question-title{
	display: flex;
	align-items: center;
}
.question {
	font-size: 36rpx;
	color: #e74c3c;
	padding: 26rpx;
	background: linear-gradient(to right, #f8f9fa, #ffffff, #f8f9fa);
	border-radius: 12px;
	margin-top: 20rpx;
	border-left: 5px solid #FF416C;
	font-weight: 700;
	box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.05);
}
</style>
