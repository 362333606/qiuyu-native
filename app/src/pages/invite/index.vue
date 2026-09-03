<template>
    <view class="partner-container">
		<image src="/static/invite1.jpg"></image>
		<view class="invite-content">
			<view>
				<canvas canvas-id="qrcode" :style="{width:qrWidth+'px',height:qrWidth+'px'}"></canvas>
			</view>
			<view v-if="inviteCode">
				<view class="invite-text">邀请码：{{inviteCode}}</view>
				<view class="invite-list" @click="tapNav">邀请的朋友</view>
			</view>
		</view>
    </view>
</template>

<script>
//index.js
//获取应用实例
import uQRCode from '@/utils/uqrcode.js';
export default {
    data() {
        return {
			type:0,
			QRurl: '',
			inviteCode:'',
			qrWidth: 120
        };
    },
    onShow: function () {
		
    },
	onLoad:function(){
		let _this = this;
		if (uni.getStorageSync('wanju_token')) {
			_this.isLogin = true;
			_this.ajax(_this.url.userDetail, "GET", null, function(resp) {
				_this.inviteCode = resp.data.inviteCode;
				_this.QRurl = 'https://qyai.qiuyu8.cn/#/pages/register/register?inviteCode='+resp.data.inviteCode;
				_this.qrFun(_this.QRurl);
			})
		}
		
	},
    methods: {
		tapNav() {
			uni.navigateTo({
			    url: '/pages/invite/list'
			});
		},
		qrFun(text) {
			uQRCode.make({
				canvasId: 'qrcode',  // 必须与上面canvas-id="qrcode"值一致
				componentInstance: this,  // 组件实例
				text: text,  // 二维码内容
				size: this.qrWidth,  // 单位px，做了手机适配
				margin: 5,
				backgroundColor: '#ffffff',  //背景颜色
				foregroundColor: '#000000',  // 前景颜色
				fileType: 'jpg',  // 二维码图片类型
				errorCorrectLevel: uQRCode.errorCorrectLevel.H,  // 容错级别
				success: res => {
					// 生成二维码成功后的操作
					// ...
				}
			})
		}
    }
};
</script>
<style>
@import './index.css';
</style>
