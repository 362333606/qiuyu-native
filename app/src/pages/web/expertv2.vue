<template>
	<view class="exv2-wrap">
		<!-- tab1 AI专家:web-view嵌线上/expertv2/ v41版(20260921 v2.2.2 张总令·APP同步最新UI)
		     原生ai_expert/list为3-31快照旧UI;此页保留git历史可回退(pages.json改回pagePath即可) -->
		<web-view :src="exUrl" :webview-styles="wvStyles" @message="onWebMsg"></web-view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			exUrl: this.exBuildUrl(),
			wvStyles: {}
		}
	},
	onShow() { // 登录/换号后令牌变化时刷新webview(仅token变化才重设src)
		const u = this.exBuildUrl();
		if (u !== this.exUrl) this.exUrl = u;
	},
	methods: {
		onWebMsg(e) {
			const list = (e && e.detail && e.detail.data) || [];
			const last = list[list.length - 1] || {};
			if (last.action === 'login') {
				uni.navigateTo({ url: '/pages/login/login' });
			} else if (last.action === 'wallet') {
				uni.switchTab({ url: '/pages/wallet/index' });
			}
		},
		exBuildUrl() { // 原生storage与webview localStorage不通:带token让H5侧吸收进wanju_token
			// (v12f深链块吸收?token=再清参);付费门票通道/策略state都要它
			let tk = '';
			try { tk = uni.getStorageSync('wanju_token') || ''; } catch (e) {}
			let lts = '';
			try { lts = uni.getStorageSync('wanju_logout_ts') || ''; } catch (e) {}
			return 'https://qyai001.cn/expertv2/?from=app' + (tk ? '&token=' + encodeURIComponent(tk) : '&logout=1' + (lts ? '&_t=' + encodeURIComponent(lts) : ''));
		}
	}
}
</script>

<style>
.exv2-wrap {
	width: 100%;
	height: 100%;
}
</style>
