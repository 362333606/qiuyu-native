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
			qaUrl: this.qaBuildUrl(), // 20260905张总批:URL令牌注入——原生storage与webview localStorage不通,带token让H5侧resolveUid换q号,积分跟登录账号走
			// 20260904 v2.1.2 张总嫌顶部网页进度条存在感太强→去掉(加载期由原生导航栏顶着)
			wvStyles: {}
		}
	},
	onShow() { // 登录/换号后令牌变化时刷新webview(仅token变化才重设src)
		const u = this.qaBuildUrl();
		if (u !== this.qaUrl) this.qaUrl = u;
	},
	methods: {
		qaBuildUrl() { // from=app:H5侧据此隐藏网页版"退出登录"(20260905张总令)+注入登录令牌
			let tk = '';
			try { tk = uni.getStorageSync('wanju_token') || ''; } catch (e) {}
			return 'https://qyai001.cn/qa/?from=app' + (tk ? '&token=' + encodeURIComponent(tk) : '');
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
