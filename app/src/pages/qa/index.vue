<template>
	<view class="qa-wrap">
		<!-- tab3智能问答:web-view嵌线上/qa/五环闭环版(20260904 v2.1.1)
		     原chat/index.vue的TUIKit老聊天在app端JS引擎(无DOM)模块链炸→整页白屏,
		     且非线上智能问答形态;此页保留git历史可回退(pages.json改回pagePath即可) -->
		<web-view :src="qaUrl" :webview-styles="wvStyles"></web-view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			qaUrl: 'https://qyai001.cn/qa/',
			wvStyles: {
				progress: {
					color: '#2f7dcb'
				}
			}
		}
	}
}
</script>

<style>
.qa-wrap {
	width: 100%;
	height: 100%;
}
</style>
