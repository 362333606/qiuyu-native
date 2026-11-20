<template>
	<view class="mtv2-wrap">
		<!-- tab2 赛事:web-view嵌线上/matchv2/ v6.18版(20260921 v2.2.2 张总令·APP同步最新UI)
		     原生match/index为3-31快照旧UI;此页保留git历史可回退(pages.json改回pagePath即可) -->
		<web-view :src="mtUrl" :webview-styles="wvStyles" @message="onWebMsg"></web-view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			mtUrl: this.mtBuildUrl(),
			wvStyles: {}
		}
	},
	onShow() { // 登录/换号后令牌变化时刷新webview(仅token变化才重设src)
		const u = this.mtBuildUrl();
		if (u !== this.mtUrl) this.mtUrl = u;
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
		mtBuildUrl() { // matchv2壳层同样吸收?token=进wanju_token(:1153双写)
			let tk = '';
			try { tk = uni.getStorageSync('wanju_token') || ''; } catch (e) {}
			let lts = '';
			try { lts = uni.getStorageSync('wanju_logout_ts') || ''; } catch (e) {}
			return 'https://qyai001.cn/matchv2/?from=app' + (tk ? '&token=' + encodeURIComponent(tk) : '&logout=1' + (lts ? '&_t=' + encodeURIComponent(lts) : ''));
		}
	}
}
</script>

<style>
.mtv2-wrap {
	width: 100%;
	height: 100%;
}
</style>
