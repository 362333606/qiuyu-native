<template>
    <view class="iv-page">
		<view class="iv-hero">
			<view class="iv-coins"><view class="iv-coin"></view><view class="iv-coin iv-coin-b"></view></view>
			<view class="iv-hero-arc"></view>
			<view class="iv-hero-glow"></view>
			<view class="iv-hero-dots"></view>
			<view class="iv-brand-row">
				<image class="iv-brand-logo" src="/static/qiuyu-logo-w.png" mode="aspectFit"></image>
				<view class="iv-hero-chip">邀请有礼</view>
			</view>
			<view class="iv-hero-title">邀请好友</view>
			<view class="iv-hero-sub">好友每解锁一场，<text class="iv-hero-sub-b">返佣金币</text>自动到账</view>
		</view>
		<view class="iv-share-card">
			<view class="iv-sc-left">
				<view class="iv-sc-label">我的邀请码 MY CODE</view>
				<view class="iv-sc-code">{{inviteCode || '····'}}</view>
				<view class="iv-copy-btn" @click="copyCode">
					<view class="iv-cp-ico"></view>
					<text>复制邀请码</text>
				</view>
			</view>
			<view class="iv-sc-right">
				<view class="iv-qr-box">
					<canvas canvas-id="qrcode" :style="{width:qrWidth+'px',height:qrWidth+'px'}"></canvas>
					<view class="iv-qr-corner iv-qr-c1"></view>
					<view class="iv-qr-corner iv-qr-c2"></view>
					<view class="iv-qr-corner iv-qr-c3"></view>
					<view class="iv-qr-corner iv-qr-c4"></view>
				</view>
				<view class="iv-qr-cap">扫码直接注册</view>
			</view>
		</view>
		<view class="iv-stats-bar">
			<view class="iv-st">
				<view class="iv-st-num">{{friendCount}}<text class="iv-st-unit">人</text></view>
				<view class="iv-st-lab">已邀请好友</view>
			</view>
			<view class="iv-st">
				<view class="iv-st-num iv-st-num-gold">{{balance}}<text class="iv-st-unit">金币</text></view>
				<view class="iv-st-lab">账户余额</view>
			</view>
			<view class="iv-st">
				<view class="iv-st-num">{{lastInvite}}</view>
				<view class="iv-st-lab">最近邀请</view>
			</view>
		</view>
		<view class="iv-sec">
			<view class="iv-sec-bar"></view>
			<view class="iv-sec-t">怎么赚金币</view>
			<view class="iv-sec-e">HOW IT WORKS</view>
		</view>
		<view class="iv-how-card">
			<view class="iv-steps">
				<view class="iv-hstep">
					<view class="iv-h-ico iv-ico-share"><view class="iv-h-no">1</view></view>
					<view class="iv-h-t">分享邀请</view>
					<view class="iv-h-s">发二维码或邀请码给好友</view>
				</view>
				<view class="iv-hlink"></view>
				<view class="iv-hstep">
					<view class="iv-h-ico iv-ico-user"><view class="iv-h-no">2</view></view>
					<view class="iv-h-t">好友注册</view>
					<view class="iv-h-s">通过你的码注册球域AI</view>
				</view>
				<view class="iv-hlink"></view>
				<view class="iv-hstep">
					<view class="iv-h-ico iv-ico-coin"><view class="iv-h-no">3</view></view>
					<view class="iv-h-t">金币到账</view>
					<view class="iv-h-s">好友每解锁返佣自动到账</view>
				</view>
			</view>
			<view class="iv-how-note">返佣进入账户余额，<text class="iv-how-note-b">解锁赛事时可直接抵扣</text></view>
		</view>
		<view class="iv-sec">
			<view class="iv-sec-bar"></view>
			<view class="iv-sec-t">活动说明</view>
			<view class="iv-sec-e">RULES</view>
		</view>
		<view class="iv-rules-card">
			<view class="iv-rule">
				<view class="iv-r-dot"></view>
				<view class="iv-rule-p">好友须通过<text class="iv-rule-b">你的二维码或邀请码</text>完成注册登录</view>
			</view>
			<view class="iv-rule">
				<view class="iv-r-dot"></view>
				<view class="iv-rule-p">好友每解锁一场，返佣<text class="iv-rule-b">自动进入账户余额</text></view>
			</view>
			<view class="iv-rule">
				<view class="iv-r-dot"></view>
				<view class="iv-rule-p">返佣记录可在<text class="iv-rule-b">邀请明细</text>中查看，金币可用于解锁任意赛事</view>
			</view>
			<view class="iv-rules-foot">球域AI · 活动规则以平台最终说明为准</view>
		</view>
		<view class="iv-sec">
			<view class="iv-sec-bar"></view>
			<view class="iv-sec-t">我邀请的好友</view>
			<view class="iv-sec-e">MY INVITEES</view>
			<view class="iv-sec-r">共 {{friendCount}} 人</view>
		</view>
		<view class="iv-friends-entry" @click="tapNav">
			<view class="iv-ava-stack">
				<view class="iv-ava" v-for="(item, index) in topFriends" :key="index">
					<image class="iv-ava-img" v-if="item.pic" :src="avatarSrc(item)" mode="aspectFill"></image>
					<text v-else>友</text>
				</view>
				<view class="iv-ava iv-ava-mute" v-if="friendCount === 0"><text>友</text></view>
			</view>
			<view class="iv-fe-info">
				<view class="iv-fe-t">邀请明细</view>
				<view class="iv-fe-s">注册与返佣明细</view>
			</view>
			<view class="iv-fe-go">查看全部</view>
		</view>
		<view class="iv-foot">QIUYU AI · INVITE &amp; EARN</view>
    </view>
</template>

<script>
//邀请返佣页（2026-09-18 v2重设计·张总批稿，与H5 chunk edcd784d 同款）
import uQRCode from '@/utils/uqrcode.js';
export default {
    data() {
        return {
			type: 0,
			QRurl: '',
			inviteCode: '',
			qrWidth: 108,
			balance: '0',
			friendList: [],
			imagebaseurl: this.ossUrl
        };
    },
    onShow: function () {

    },
	onLoad: function(){
		let _this = this;
		if (uni.getStorageSync('wanju_token')) {
			_this.ajax(_this.url.userDetail, "GET", null, function(resp) {
				_this.inviteCode = resp.data.inviteCode || '';
				let bal = resp.data.balance;
				_this.balance = (bal === null || bal === undefined) ? '0' : bal;
				_this.QRurl = 'https://qyai001.cn/#/pages/register/register?inviteCode='+resp.data.inviteCode;
				_this.qrFun(_this.QRurl);
			});
			_this.ajax(_this.url.userInviteList, "GET", {page: 1, pageSize: 50}, function(resp) {
				_this.friendList = resp.data || [];
			});
		} else {
			uni.showToast({icon:'none',title:'请登录后再操作'});
		}
	},
	computed: {
		friendCount() {
			return this.friendList.length;
		},
		lastInvite() {
			if (!this.friendList.length) return '—';
			let t = (this.friendList[0].time || '').slice(5, 16);
			return t || '—';
		},
		topFriends() {
			return this.friendList.slice(0, 3);
		}
	},
    methods: {
		tapNav() {
			uni.navigateTo({
			    url: '/pages/invite/list'
			});
		},
		avatarSrc(item) {
			if (!item || !item.pic) return '';
			return item.pic.indexOf('http') === 0 ? item.pic : this.imagebaseurl + item.pic;
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
