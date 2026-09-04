<template>
	<view class="pay-wrap">
		<!-- APP收银台容器(2026-09-05 v2.1.8):payment组件在APP端无window.location,
		     汇付/拉卡拉H5收银台在本页web-view内打开;支付完成/关闭由用户返回 -->
		<web-view :src="payUrl"></web-view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			payUrl: ''
		}
	},
	onLoad(opts) {
		if (opts && opts.u) {
			this.payUrl = decodeURIComponent(opts.u);
		}
	}
}
</script>

<style>
.pay-wrap {
	width: 100%;
	height: 100%;
}
</style>
