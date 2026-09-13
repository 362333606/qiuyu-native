<template>
    <view class="qt-page">
		<view class="qiuyu-statusbar"></view>
		<!-- ===== 头部(2026-09-14 v3生产版:去顶部解锁记录pill与功能列表去重) ===== -->
		<view class="head">
			<view class="head-top">
				<view class="head-pill" @click="toDownload">APP下载</view>
			</view>
			<view class="eng-label">QIUYU AI · ACCOUNT</view>
			<view class="head-name">个人中心</view>
		</view>

		<!-- ===== 用户卡片 ===== -->
		<view class="user-card">
			<view class="uc-row" @tap="!isLogin && toLogin()">
				<view class="avatar-ring">
					<image class="avatar" :src="imagebaseurl + avatarUrl" mode="aspectFill"></image>
				</view>
				<view class="uc-info">
					<view class="uc-name" v-if="isLogin">
						<text class="uname">{{ nickName || '球域用户' }}</text>
						<text class="vip-badge" v-if="vipType > 0">{{ vipTypeName }}</text>
					</view>
					<view class="uc-name" v-else><text class="uname">立即登录</text></view>
					<view class="uc-sub" v-if="isLogin && vipType > 0 && vipExpireTime">有效期至 {{ vipExpireTime }}</view>
					<view class="uc-sub" v-else-if="isLogin">开通会员享受更多权益</view>
					<view class="uc-sub" v-else>登录后查看会员信息</view>
				</view>
			</view>
			<!-- 微信绑定行:跳手机号绑定页(/user/bindphone) -->
			<view class="bind-row" v-if="isLogin" @tap="toBindPhone">
				<view class="wx-ico">
					<image class="wx-svg" src="/static/wx-white.png" mode="aspectFit"></image>
				</view>
				<view class="bind-txt">
					<view class="bt-main">微信一键登录</view>
					<view class="bt-sub">绑定手机号后可用手机号登录</view>
				</view>
				<view class="bind-btn">去绑定</view>
			</view>
			<!-- 余额 -->
			<view class="wallet-row" v-if="isLogin">
				<view class="balance">
					<view class="balance-label">钱包余额 (元)</view>
					<view class="balance-num">{{ balance.toFixed(2) }}</view>
				</view>
				<view class="recharge-btn" @tap="toPage('/pages/recharge/index')">充值</view>
			</view>
			<view class="wallet-row" v-else>
				<view class="balance">
					<view class="balance-label">钱包余额 (元)</view>
					<view class="balance-num">0.00</view>
				</view>
				<view class="recharge-btn" @tap="toLogin">登录</view>
			</view>
		</view>

		<!-- ===== 会员中心(档位选择制) ===== -->
		<view class="section">
			<view class="sec-head">
				<view class="sec-bar"></view>
				<view class="sec-title">会员中心</view>
				<view class="sec-eng">MEMBERSHIP</view>
			</view>

			<view class="tier-tabs" v-if="vipCardList.length > 0">
				<view class="tt-slider" :class="{ gold: currentCard && currentCard.type == 3 }" :style="'transform:translateX(' + currentTier * 100 + '%)'"></view>
				<view class="tt" :class="{ on: currentTier == index }" v-for="(item, index) in vipCardList" :key="index" @tap="currentTier = index">
					{{ item.title }} ¥{{ item.price }}
				</view>
			</view>

			<view class="m-card show" v-if="currentCard">
				<view class="m-top">
					<view class="ai-chip">
						<image class="chip-logo" src="/static/qiuyu-logo.png" mode="aspectFit"></image>
						<text>球域AI</text>
					</view>
					<view class="tier-pill" :class="{ gold: currentCard.type == 3 }">{{ tierEng[currentCard.type] || 'VIP' }}</view>
				</view>
				<view class="m-eng">QIUYU AI · VIP {{ currentCard.days }} DAYS</view>
				<view class="m-main">
					<view class="m-tier" :class="{ 'm-tier-gold': currentCard.type == 3 }">{{ currentCard.title }}会员</view>
					<view class="m-price">¥{{ currentCard.price }}<text class="m-price-d"> /{{ currentCard.days }}天</text></view>
				</view>
				<view class="m-save" v-if="saveAmount > 0">较按月购买 省 ¥{{ saveAmount }}</view>
				<view class="m-facts">
					<view class="fact"><view class="fact-b">{{ currentCard.totalNum }}场</view><view class="fact-s">总计解析</view></view>
					<view class="fact"><view class="fact-b">{{ currentCard.type == 3 ? '无限' : currentCard.dayNum + '次' }}</view><view class="fact-s">单日解析</view></view>
					<view class="fact"><view class="fact-b">¥{{ currentCard.unitPrice }}</view><view class="fact-s">超出/场</view></view>
				</view>
				<view class="m-foot">
					<view class="m-discount">超出享 {{ tierDiscount[currentCard.type] || '' }} 折</view>
					<view class="m-expire" v-if="vipType == currentCard.type && vipExpireTime">有效期至 {{ vipExpireTime }}</view>
					<view class="m-expire" v-else>未开通</view>
					<view class="m-go" @tap="openVip(currentCard)">{{ vipType == currentCard.type && vipExpireTime ? '立即续费' : '立即开通' }}</view>
				</view>
			</view>

			<!-- 会员特权(线上真实菜单 type=6) -->
			<view class="perk-card" v-if="navMenu.length > 0">
				<view class="perk" v-for="(menuItem, idx) in navMenu" :key="idx">
					<view class="perk-ico"><image class="perk-img" :src="imagebaseurl + menuItem.img" mode="aspectFit"></image></view>
					<view class="perk-t">{{ menuItem.title }}</view>
				</view>
			</view>
		</view>

		<!-- ===== 常用功能(全真实跳转) ===== -->
		<view class="section">
			<view class="sec-head">
				<view class="sec-bar"></view>
				<view class="sec-title">常用功能</view>
				<view class="sec-eng">SERVICES</view>
			</view>
			<view class="menu-card">
				<view class="menu-item" @tap="toInvite">
					<view class="mi-ico"><image class="mi-img" src="/static/icon/menu-invite.png" mode="aspectFit"></image></view>
					<view class="mi-body">
						<view class="mi-t">邀请返佣</view>
						<view class="mi-s">邀请好友解锁成功，获得奖励</view>
					</view>
					<view class="mi-tag">有奖励</view>
					<view class="mi-arrow">›</view>
				</view>
				<view class="menu-item" @tap="toPaidList">
					<view class="mi-ico"><image class="mi-img" src="/static/icon/menu-record.png" mode="aspectFit"></image></view>
					<view class="mi-body">
						<view class="mi-t">解锁记录</view>
						<view class="mi-s">已解锁赛事与判定结果</view>
					</view>
					<view class="mi-arrow">›</view>
				</view>
				<view class="menu-item" @tap="showService">
					<view class="mi-ico"><image class="mi-img" src="/static/icon/menu-service.png" mode="aspectFit"></image></view>
					<view class="mi-body">
						<view class="mi-t">联系客服</view>
						<view class="mi-s">问题咨询 · 解锁异常处理</view>
					</view>
					<view class="mi-arrow">›</view>
				</view>
				<view class="menu-item" @tap="checkUpdate">
					<view class="mi-ico"><image class="mi-img" src="/static/icon/menu-update.png" mode="aspectFit"></image></view>
					<view class="mi-body">
						<view class="mi-t">检查更新</view>
						<view class="mi-s">当前版本 v{{ appVersion }}</view>
					</view>
					<view class="mi-arrow">›</view>
				</view>
			</view>
			<view class="logout-card" v-if="isLogin" @tap="toLogout">退出登录</view>
		</view>

		<!-- 客服二维码弹窗(与chat页同源 hotWord.customerService) -->
		<uni-popup ref="servicePopup" background-color="#fff">
			<view class="service-pop">
				<view class="service-title">联系客服</view>
				<image class="service-img" v-if="customerServiceImg" :src="imagebaseurl + customerServiceImg" mode="widthFix"></image>
				<view class="service-tip">扫码添加客服微信</view>
			</view>
		</uni-popup>

		<!-- 支付弹窗 -->
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
export default {
	components: {
		payment
	},
    data() {
        return {
			nickName: uni.getStorageSync('wanju_nickName'),
			avatarUrl: 'comm/images/game_ai_logo.png',
			balance: 0,
			imagebaseurl: this.ossUrl,
			vipType: 0,
			vipExpireTime: '',
			currentTier: 0,
			navMenu: [],
			vipCardList: [],
			isPay: false,
			payOrderId: 0,
			payAmount: 0,
			isLogin: false,
			appVersion: '2.2.0',
			customerServiceImg: '',
			// 折扣口径: 2026-09-14 张总定 月9折/季8折/年5折
			tierDiscount: { 1: '9', 2: '8', 3: '5' },
			tierEng: { 1: 'MONTHLY', 2: 'QUARTERLY', 3: 'ANNUAL · 尊享' }
        };
    },
	computed: {
		vipTypeName() {
			return ({ 1: '月卡会员', 2: '季卡会员', 3: '年卡会员' })[this.vipType] || '';
		},
		currentCard() {
			return this.vipCardList[this.currentTier] || null;
		},
		saveAmount() {
			// 较按月购买: 季=3×月价-季价 年=12×月价-年价
			if (this.vipCardList.length < 2 || !this.currentCard) return 0;
			let month = this.vipCardList[0].price;
			let t = this.currentCard.type;
			if (t != 2 && t != 3) return 0;
			let save = (t == 2 ? 3 : 12) * month - this.currentCard.price;
			return save > 0 ? Math.round(save) : 0;
		}
	},
    onLoad: function (options) {
		if (options.token) {
			uni.setStorageSync("wanju_token", options.token);
		}
		// #ifdef APP-PLUS
		try { this.appVersion = plus.runtime.version || this.appVersion; } catch (e) {}
		// #endif
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
    methods: {
		toDownload: function(){
			// #ifdef H5
			window.location.href = "/app"
			// #endif
			// #ifdef APP-PLUS
			uni.showToast({icon:'none', title:'您已在APP内'})
			// #endif
		},
		toBindPhone: function(){
			uni.navigateTo({ url: '/pages/login/phone' });
		},
		showService: function(){
			let that = this;
			if (!that.customerServiceImg) {
				that.ajax(that.url.hotWord, "get", {}, function(resp){
					if (resp.data && resp.data.customerService) {
						that.customerServiceImg = resp.data.customerService;
					}
				});
			}
			that.$refs.servicePopup.open('center');
		},
		checkUpdate: function(){
			uni.showModal({
				title: '版本更新',
				content: '当前版本 v' + this.appVersion + '，已是最新版本',
				showCancel: false
			});
		},
		toLogout:function(){
			uni.showModal({
				title: '退出登录',
				content: '确定退出当前账号？',
				success: (m) => {
					if (!m.confirm) return;
					this.isLogin = false;
					this.balance = 0;
					try { uni.removeStorageSync('wanju_token'); uni.removeStorageSync('wanju_nickName'); uni.removeStorageSync('wanju_avatarUrl'); } catch(e){}
					// #ifdef APP-PLUS
					try { plus.storage.removeItem('unlocked_'); } catch(e) {}
					// #endif
					uni.showToast({icon:'none', title:'已退出'});
					setTimeout(() => { uni.navigateTo({ url: '/pages/login/login' }); }, 600);
				}
			});
		},
		toLogin:function(){
			// #ifdef H5
			if (this.isWeiXinLogin()) { window.location.href = "/#/pages/login/index"; return; }
			// #endif
			uni.navigateTo({url: "/pages/login/login"})
		},
		isWeiXinLogin() {
		    // #ifdef H5
		    var ua = window.navigator.userAgent.toLowerCase();
		    return ua.match(/MicroMessenger/i) == 'micromessenger';
		    // #endif
		    // #ifndef H5
		    return false;
		    // #endif
		},
		toPaidList:function(){
			if (!this.isLogin) {
				uni.showToast({icon: 'none',title: '请登录后再操作'});
				return;
			}
			uni.navigateTo({ url: '/pages/demand/list' })
		},
		toInvite() {
			if (!this.isLogin) {
				uni.showToast({icon: 'none',title: '请登录后再操作'});
				return;
			}
			uni.navigateTo({ url: '/pages/invite/index' })
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
			if (!this.isLogin) {
				uni.showToast({icon: 'none',title: '请登录后再操作'});
				return;
			}
			uni.navigateTo({ url: url })
		},
		closePay: function() { this.isPay = false; },
		okPay: function() { this.isPay = false; },
		loadVipCardList:function(){
			let that = this
			that.ajax(that.url.vipCard,"get",{},function(resp){
				let list = resp.data || [];
				list.sort(function(a,b){ return a.type - b.type; });
				that.vipCardList = list;
				if (that.vipType > 0) that.currentTier = Math.min(that.vipType - 1, list.length - 1);
			})
		},
		async initPage() {
			let that = this
			that.ajax(that.url.menuList, "GET", {type: 6}, function(resp) {
				 that.navMenu = resp.data || [];
			})
			that.loadVipCardList();
		},
		userDetail:function(){
			let that = this
			that.ajax(that.url.userDetail, "GET", null, function(resp) {
				let result = resp.data;
				if (result.avatarUrl) that.avatarUrl = result.avatarUrl;
				if (result.name) { that.nickName = result.name; uni.setStorageSync('wanju_nickName', result.name); }
				that.balance = result.balance;
				that.vipType = result.vipType;
				that.vipExpireTime = result.vipExpireTime;
				if (that.vipType > 0) that.currentTier = Math.min(that.vipType - 1, Math.max(that.vipCardList.length - 1, 0));
			})
		}
    }
};
</script>
<style>
@import './index.css';
</style>
