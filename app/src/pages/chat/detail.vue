<template>
	<view class="goods-container" >
		
		<view class="question-content">
			<view class="question-title">
				<uni-icons type="help-filled" size="30" color="#FF4B2B"></uni-icons> 
				<h3 style="margin-left: 10rpx;color: #1a2a6c;">分析问题</h3>
			</view>
			<view style="font-size: 24rpx;">解析结果由 AI生成，内容仅供参考，请仔细甄别。</view>
			<view class="question">{{title}}</view>
		</view>
		
		<view class="rich-text raw-text-container" v-html="processedHtmlContent" style="padding: 20rpx;"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:'',
				htmlContent:''
			}
		},
		onLoad:function(options) {
			if(options.token) {
			  uni.setStorageSync("wanju_token", options.token);
			}
			if (uni.getStorageSync('wanju_token') != '') {
				let that = this
				that.ajax(that.url.demandDetail+"/" + options.id, "GET", null, function(resp) {
					that.title = resp.data.title
					that.htmlContent = resp.data.content;
				})
			}
		},
		computed: {
		    processedHtmlContent() {
		      // 将 **内容** 替换为 <strong>内容</strong>
		      return this.htmlContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
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
// .raw-text-container::after{
//   content: "球域Ai赛事智能预测系统";
//   position: absolute;
//   top: 35%;
//   left: 0%;
//   transform: translate(-50%, -50%);
//   transform: rotate(-45deg);
//   color: rgba(146, 136, 136, 0.3); /* 半透明白色 */
//   font-size: 34px;
//   font-weight: bold;
// }
// .raw-text-container::before {
//   content: "公众号：球域Ai";
//   position: absolute;
//   top: 60%;
//   left: 10%;
//   transform: translate(-50%, -50%);
//   transform: rotate(-45deg);
//   color: rgba(146, 136, 136, 0.3); /* 半透明白色 */
//   font-size: 34px;
//   font-weight: bold;
// }
.raw-text-container {
  /* 关键样式：保留所有空格和换行 */
  white-space: pre-wrap;
  
  /* 可选样式：增强可读性 */
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 18px;
  line-height: 1.8;
  padding: 12px;
  background-image: url(/static/jiexi_bg.jpg);
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
