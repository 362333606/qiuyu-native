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
			// 20260904 v2.1.2 张总嫌顶部网页进度条存在感太强→去掉(加载期由原生导航栏顶着)
			wvStyles: {}
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
