<template>
    <view class="iv-page">
		<view class="iv-head">
			<view class="iv-deco1"></view>
			<view class="iv-deco2"></view>
			<view class="iv-eng-label">QIUYU AI · INVITE &amp; REBATE</view>
			<view class="iv-head-name">邀请好友 · 赚取奖励</view>
		</view>
		<view class="iv-card iv-banner-card">
			<image class="iv-banner" src="/static/invite1.jpg" mode="widthFix"></image>
		</view>
		<view class="iv-card iv-qr-card">
			<view class="iv-qr-wrap">
				<canvas canvas-id="qrcode" :style="{width:qrWidth+'px',height:qrWidth+'px'}"></canvas>
			</view>
			<view class="iv-qr-tip">扫二维码注册，自动关联你的邀请码</view>
			<view class="iv-code-row">
				<view class="iv-code-pill">邀请码：{{inviteCode || '生成中'}}</view>
				<view class="iv-copy-btn" @click="copyCode">复制邀请码</view>
			</view>
			<view class="iv-steps">
				<view class="iv-step">
					<view class="iv-step-no">1</view>
					<view class="iv-step-t"><text class="iv-b">分享二维码或邀请码</text>给微信好友</view>
				</view>
				<view class="iv-step">
					<view class="iv-step-no">2</view>
					<view class="iv-step-t">好友<text class="iv-b">注册登录</text>球域AI</view>
				</view>
				<view class="iv-step">
					<view class="iv-step-no">3</view>
					<view class="iv-step-t">好友<text class="iv-b">解锁成功</text>后，奖励自动到账</view>
				</view>
			</view>
		</view>
		<view class="iv-sec-head">
			<view class="iv-sec-bar"></view>
			<view class="iv-sec-title">邀请的朋友</view>
			<view class="iv-sec-eng">MY INVITEES</view>
		</view>
		<view class="iv-card iv-friend-entry" @click="tapNav">
			<view class="iv-fe-ico"><view class="iv-fe-ico-core"></view></view>
			<view class="iv-fe-info">
				<view class="iv-fe-t">查看我邀请的好友</view>
				<view class="iv-fe-s">仅显示通过你的邀请码注册的好友</view>
			</view>
			<view class="iv-fe-arrow">›</view>
		</view>
		<view class="iv-foot">球域AI · 邀请好友 赚取奖励</view>
    </view>
</template>

<script>
//邀请返佣页（2026-09-18 重做，与H5 chunk edcd784d 同款设计）
import uQRCode from '@/utils/uqrcode.js';
export default {
    data() {
        return {
			type:0,
			QRurl: '',
			inviteCode:'',
			qrWidth: 150
        };
    },
    onShow: function () {

    },
	onLoad:function(){
		let _this = this;
		if (uni.getStorageSync('wanju_token')) {
			_this.ajax(_this.url.userDetail, "GET", null, function(resp) {
				_this.inviteCode = resp.data.inviteCode;
				_this.QRurl = 'https://qyai001.cn/#/pages/register/register?inviteCode='+resp.data.inviteCode;
				_this.qrFun(_this.QRurl);
			})
		} else {
			uni.showToast({icon:'none',title:'请登录后再操作'});
		}
	},
    methods: {
		tapNav() {
			uni.navigateTo({
			    url: '/pages/invite/list'
			});
		},
		copyCode() {
			let _this = this;
			if (!_this.inviteCode) {
				uni.showToast({icon:'none',title:'邀请码生成中，请稍候'});
				return;
			}
			uni.setClipboardData({
				data: _this.inviteCode,
				success() {
					uni.showToast({icon:'none',title:'邀请码已复制：'+_this.inviteCode});
				},
				fail() {
					uni.showToast({icon:'none',title:'复制失败，请手动记录'});
				}
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
