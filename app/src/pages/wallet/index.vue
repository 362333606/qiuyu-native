<template>
    <view class="partner-container">
		<view class="qiuyu-statusbar"></view>
		<!-- 自定义导航栏 -->
		<view class="gc-head">
			<view class="gc-head-title" @click="toDownload">
				APP下载
			</view>
			<view class="gc-head-img" @click="menuToggle('top')">
				<text>钱包</text>
			</view>
			<view class="gc-post-btn" style="text-align: right" @click="toPaidList()">
				解锁记录
			</view>
		</view>
		<view style="margin: 40rpx;">
			<view class="partner-head">
					<view class="user-head">
						<view class="user-head-item">
							<image :src="imagebaseurl + avatarUrl" class="userinfo-avatar" v-if="avatarUrl"></image>
						</view>
					</view>
				</view>
				<view v-if="!isLogin" class="no-login" @tap="toLogin">立即登录</view>
				<view class="wallet" v-if="isLogin">
					<view class="wallet-info">
						<view class="wallet-all">
							<text class="wallet-title">钱包余额</text>
							<view class="wallet-balance mount-family">{{balance.toFixed(2)}}</view>
						</view>
						<view class="wallet-level" @tap="toPage('/pages/recharge/index')" v-if="isLogin">
							<text class="wallet-btn">充值</text>
						</view>
					</view>
				</view>
				<view style="color: white;border-bottom: 1px solid #dfebef;padding: 10px;margin: 10px 15px;" @click="toInvite()">
					<text>邀请返佣</text>
					<text style="float: right;"><text style="font-size: 24rpx;margin-right: 5px;">邀请好友解锁成功，获得奖励</text>></text>
				</view>
				<swiper class="swiper" circular :current="current" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
								:duration="duration">
				<swiper-item v-for="(item, index) in vipCardList" :key="index">
					<view class="swiper-item">
						<view class="wallet-vip" :style="'background: linear-gradient(to right, '+ bgColors[index].bg + ')!important;'">
							<view class="wallet-info">
								<view class="" style="width: 70%;">
									<view class="vip-title">
										<text style="font-size: 50rpx;flex-grow: 2;">{{item.title}}会员</text>
										<text style="flex-grow: 2;margin-left: 4rpx;" class="mount-family">{{item.price}}/{{item.days}}天</text>
									</view>
									<view class="wallet-desc mount-family ">总计{{item.totalNum}}场解析</view>
									<view class="wallet-desc mount-family ">赛事解析单日{{item.dayNum}}次 超出{{item.unitPrice}}/场</view>
								</view>
								<view class="wallet-level" style="margin-top: -30rpx;">
										<image :src="imagebaseurl + item.img" class="vip-logo"></image>
								</view>
							</view>
							<view class="wallet-option kaitong-content">
								<view style="flex-grow: 3" class="mount-family" v-if="vipType == item.type && vipExpireTime">有效期：{{vipExpireTime}}</view>
								<view style="flex-grow: 3" v-else>开通会员享受权益</view>
								<view style="flex-grow: 1;font-size: 30rpx;" @click="openVip(item)" class="wallet-btn" v-if="isLogin">
									<text v-if="vipType == item.type && vipExpireTime">立即续费</text>
									<text v-else>立即开通</text>
								</view>
							</view>
						</view>
						<view class="my-icon-menu" v-if="navMenu.length > 0">
							<view class="vip-pro-title">{{item.title}}会员特权</view>
							 <view class="my-icon-menu-item" v-for="(menuItem, indexStep) in navMenu">
								 <view class="my-icon-menu-img">
									 <image :src="imagebaseurl + menuItem.img" />
								 </view>
								 <view style="font-size: 24rpx;">{{menuItem.title}}</view>
								 <text style="font-size: 20rpx;color: #ccc;">{{item.msg.split(',')[indexStep]}}</text>
							 </view>
						</view>
					</view>
					
				</swiper-item>
			</swiper>
		</view>

	<view class="show-popup" v-if="isPay">
		<view class="popup-mask" @click="closePay"></view>
		<view class="popup-contents">
			<payment @toCancel="closePay" @okPay="okPay" :payTypeId="2" :payOrderId="payOrderId" :payAmount="payAmount"></payment>
		</view>
	</view>
		
		
    </view>
</template>

<script>
const AUTH = require('@/utils/auth');
import payment from '@/components/payment';
//index.js
//获取应用实例
export default {
	components: {
		payment
	},
    data() {
        return {
			wxlogin: false,
			type:0,
			nickName: uni.getStorageSync('wanju_nickName'),
			// avatarUrl: uni.getStorageSync('wanju_avatarUrl'),
			avatarUrl:'comm/images/game_ai_logo.png',
			num:0,
			balance:0,
			dotStyle: 'square-dot',
			balanceList:[],
			imagebaseurl: this.ossUrl,
			vipType:0,
			vipExpireTime:'',
			current:0,
			
			navMenu:[],
			indicatorDots: true,
			autoplay: false,
			interval: 2000,
			duration: 500,
			vipCardList:[],
			isPay:false,
			payOrderId:0,
			payAmount:0,
			isLogin: false,
			bgColors: [
				{bg: "#dfebef, #bccad4"},
				{bg: "#e9f8f2, #92c9b4"},
				{bg: "#f8f7d5, #f8d272"}
			]
        };
    },
    onLoad: function (options) {
		if(options.token) {
		  uni.setStorageSync("wanju_token", options.token);
		}
		if (!uni.getStorageSync('wanju_token')) {
			uni.showToast({icon: 'none',title: '请登录后再操作'});
			return;
		}
    },
	onShow: function() {
		if (uni.getStorageSync('wanju_token')) {
			this.isLogin = true;
			this.userDetail()
		}
		this.initPage();
	},
	onReachBottom: function () {
		// 滚动刷新
	},
    methods: {
		toDownload: function(){
			window.location.href = "/app"
		},
		toLogin:function(){
			this.isWeiXinLogin() ? window.location.href = "/#/pages/login/index" : uni.navigateTo({url: "/pages/login/login"})
		},
		isWeiXinLogin() {
		    var ua = window.navigator.userAgent.toLowerCase();
		    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
		        return true; // 微信中打开
		    } else {
		        return false; // 普通浏览器中打开
		    }
		},
		toPaidList:function(){
			if (!this.isLogin) {
				uni.showToast({icon: 'none',title: '请登录后再操作'});
				return;
			}
			uni.navigateTo({
				url:'/pages/demand/list'
			})
		},
		toInvite() {
			if (!this.isLogin) {
				uni.showToast({icon: 'none',title: '请登录后再操作'});
				return;
			}
			uni.navigateTo({
				url:'/pages/invite/index'
			})
		},
		// 返回上一级
		goBack(){
			let back = getCurrentPages();  
			 if(back && back.length>1) {  
			uni.navigateBack({  
			  delta: 1  
			});
			} else {  
			history.back();  
			 }  
		},
		openVip:function(item){
			if (!this.isLogin) {
				uni.showToast({icon: 'none',title: '请登录后再操作'});
				return;
			}
			this.payAmount = item.price;
			this.payOrderId = item.id;
			this.isPay = true;
		},
		toPage:function(url){
			uni.navigateTo({
				url:url
			})
		},
		closePay: function() {
			this.isPay = false;
		},
		okPay: function() {
			this.isPay = false;
			// this.initBalance();
		},
		loadVipCardList:function(){
			let that = this
			that.ajax(that.url.vipCard,"get",{},function(resp){
				that.vipCardList = resp.data
			})
		},
		tapNav(e) {
		    const url = e.currentTarget.dataset.url;
			if (url.includes("http")) {
				window.location.href = url;
			} else {
				uni.navigateTo({
				    url: url
				});
			}
		},
		async initPage() {
			
			let that = this
			that.ajax(that.url.menuList, "GET", {type: 6}, function(resp) {
				 that.navMenu = resp.data;
			})
			that.loadVipCardList();
		},
		userDetail:function(){
			
			let that = this
			that.ajax(that.url.userDetail, "GET", null, function(resp) {
				let result = resp.data;
				if (result.avatarUrl) {
					that.avatarUrl = result.avatarUrl;
				}
				that.name = result.name;
				that.balance = result.balance;
				that.vipType = result.vipType;
				that.vipExpireTime = result.vipExpireTime;
				that.current = result.vipType - 1;
			})
		},
		
    }
};
</script>
<style>
@import './index.css';
</style>
