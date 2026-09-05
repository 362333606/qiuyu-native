<template>
	<view>
		<view class="popup-title">
			<text class="popup-cancel"></text>
			<text class="popup-title-text">选择支付方式</text>
			<text class="popup-ok-btn" @tap="cancel">取消</text>
		</view>
		<view class="panyment-title"><text>{{payTitle[payType]}}</text></view>
		<view class="panyment-price">
			¥<text class="amount">{{payAmount.toFixed(2)}}</text></view>
		<view class="panyment-title" style="margin-bottom: 10px;color: #fd2e54;"><text>{{payInfo}}</text></view>
		<uni-list>
			<uni-list-item title="钱包余额" :note="'余额 '+userBalance" v-if="payType == 3 || payType == 4 || payType == 5 || payType == 6"
				thumb="/static/balance_pay.png" :disabled="balanceDisabled"
				thumb-size="lg" :clickable="!balanceDisabled" @click="changePayType(1)">
				<template v-slot:footer>
					<image class="icon-image" :src="payWay == 1 ? selected : selectedNo"></image>
				</template>
			</uni-list-item>
			<uni-list-item title="微信扫码支付" note="截图后微信扫一扫付款" v-if="iswx || isApp"
				thumb="/static/wechat_pay.png"
				thumb-size="lg" clickable @click="changePayType(2)">
				<template v-slot:footer>
					<image class="icon-image" :src="payWay == 2 ? selected : selectedNo"></image>
				</template>
			</uni-list-item>
			<!-- <uni-list-item title="组合支付" :note="groupNote" v-if="groupPayType && payType != 0"
				thumb="/static/group_pay.png" :disabled="!groupPayType"
				thumb-size="lg" :clickable="groupPayType" @click="changePayType(3)">
				<template v-slot:footer>
					<image class="icon-image" :src="payWay == 3 ? selected : selectedNo"></image>
				</template>
			</uni-list-item> -->
			<uni-list-item title="支付宝支付" note="10亿用户都在用,更安全,更放心"
				thumb="/static/ali_pay.png"
				thumb-size="lg" clickable @click="changePayType(4)">
				<template v-slot:footer>
					<image class="icon-image" :src="payWay == 4 ? selected : selectedNo"></image>
				</template>
			</uni-list-item>
		</uni-list>
		<view class="submit-pay" @tap="confirmPay">
			<text>确认支付</text>
		</view>
		<!-- 2026-09-05 v2.1.12: 微信扫码支付弹层(截图→微信扫一扫→相册识别,同机可付) -->
		<view class="qr-mask" v-if="qrShow" @tap="closeQr">
			<view class="qr-card" @tap.stop>
				<text class="qr-title">微信扫码支付</text>
				<text class="qr-amount">¥{{payAmount.toFixed(2)}}</text>
				<image class="qr-img" :src="qrUrl" mode="aspectFit"></image>
				<view class="qr-steps">
					<text>① 截图保存这张二维码</text>
					<text>② 打开微信「扫一扫」</text>
					<text>③ 点右下角「相册」选截图</text>
					<text>④ 付款后本页自动到账</text>
				</view>
				<view class="qr-done-btn" @tap="checkQrNow">我已完成支付</view>
				<text class="qr-cancel" @tap="closeQr">取消</text>
			</view>
		</view>
	</view>
</template>
<script>
	const wxpay = require('@/utils/pay.js');
	export default {
		props: {
			payTypeId: {
			    type: Number,
			    default: 0
			},
			payOrderId: {
			    type: Number,
			    default: 0
			},
			payAmount: {
			    type: Number,
			    default: 0
			},
			markIndex: {
				type: Number,
				default: 0
			},
			info: {
				type: String,
				default: ''
			}
		},
	    data() {
	        return {
				iswx: false,
				isApp: false, // 2026-09-05 v2.1.12:APP端微信=扫码支付,恢复可见
				qrShow: false,
				qrUrl: '',
				qrOrderNo: '',
				qrTimer: null,
				gratuityArray: [],
				chooseIndex:'',
				payWay:0,
				userBalance:0,
				balanceDisabled:true,
				groupPayType:false,
				groupReAmount:0,
				groupNote:'',
				payType:this.payTypeId,
				payInfo:this.info,
				selected:'/static/payment_check.png',
				selectedNo:'/static/payment_check_no.png',
				payTitle:['充值','解锁支付','开通会员','球域Ai互动','解锁赛事','解锁超级精选赛事',"解锁专家赛事"]
				}
			},
			mounted: function () {
				// #ifdef APP-PLUS
				this.isApp = true;
				// #endif
				if (this.payType == 0 || this.payType == 1) {
					// #ifdef APP-PLUS
					this.payWay = 2; // 2026-09-05 v2.1.12:APP端默认微信扫码支付(弹二维码,不走JSAPI死路)
					// #endif
					// #ifndef APP-PLUS
					this.payWay = 2;
					// #endif
				} else {
					this.getBalance();
				}
				if(this.isWeiXinLogin()) {
					 this.iswx = true;
				} else {
					this.payWay = 4;
				}
			},
			beforeDestroy() { this.stopQrPoll(); },
			methods: {
				// ===== 2026-09-05 v2.1.12: APP端微信扫码支付 =====
				wxQrPay() {
					let _this = this;
					let params = {};
					params.payOrderId = this.payOrderId;
					params.payType = this.payType;
					params.body = this.payTitle[this.payType];
					if (uni.getStorageSync('wanju_token')) {
						params.token = uni.getStorageSync('wanju_token')
					}
					_this.ajax(_this.url.qrCreate, "POST", params, function(res) {
						if (res && res.data && res.data.qr_url) {
							_this.qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?data=' + encodeURIComponent(res.data.qr_url) + '&size=220x220';
							_this.qrOrderNo = res.data.order_no || '';
							_this.qrShow = true;
							_this.startQrPoll();
						} else {
							uni.showToast({icon: 'none', title: (res && res.msg) || '二维码生成失败'});
						}
					});
				},
				startQrPoll() {
					this.stopQrPoll();
					let n = 0;
					let _this = this;
					this.qrTimer = setInterval(function() {
						n++;
						if (n > 100 || !_this.qrShow) { _this.stopQrPoll(); return; } // H5同款:上限100次(约5分钟)
						_this.checkQr(false);
					}, 3000);
				},
				checkQr(manual) {
					let _this = this;
					if (!_this.qrOrderNo) return;
					uni.request({
						url: 'https://qyai001.cn/api/pay/qr-status?order_no=' + encodeURIComponent(_this.qrOrderNo),
						method: 'GET',
						success: function(resp) {
							let d = resp && resp.data;
							if (d && d.code == 200 && d.data && d.data.status === 'paid') {
								_this.stopQrPoll();
								_this.qrShow = false;
								uni.showToast({title: '支付成功'});
								setTimeout(() => { _this.$emit("okPay"); }, 1200);
							} else if (manual) {
								uni.showToast({icon: 'none', title: '还没查到付款,过几秒再点'});
							}
						}
					});
				},
				checkQrNow() { this.checkQr(true); },
				stopQrPoll() {
					if (this.qrTimer) { clearInterval(this.qrTimer); this.qrTimer = null; }
				},
				closeQr() {
					this.stopQrPoll();
					this.qrShow = false;
				},
				isWeiXinLogin() {
					// #ifdef H5
				    var ua = window.navigator.userAgent.toLowerCase();
				    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
				        return true; // 微信中打开
				    } else {
				        return false; // 普通浏览器中打开
				    }
					// #endif
					// #ifndef H5
					return false; // 2026-09-05 v2.1.8:APP逻辑层无window(第5颗地雷,挂载即炸),APP恒为非微信环境
					// #endif
				},
				changePayType(type) {
					console.info(type)
					this.payWay = type;
				},
				confirmPay(){
					// #ifdef APP-PLUS
					if (this.payWay == 2) { this.wxQrPay(); return; } // 2026-09-05 v2.1.12:APP微信=扫码,走qr-create(复用H5外部浏览器同款线上链路,后端零改)
					// #endif
					if (this.payWay == 0) {
						uni.showToast({icon: 'none',title: '请选择支付方式'}); 
						return;
					}
					// 防止连续点击--开始
					if (this.payButtonClicked) {
					    uni.showToast({
					        title: '休息一下~',
					        icon: 'none'
					    });
					    return;
					}
					this.payButtonClicked = true;
					setTimeout(() => {
					    this.payButtonClicked = false;
					}, 3000); // 可自行修改时间间隔（目前是3秒内只能点击一次支付按钮）
					// 防止连续点击--结束
					
					uni.showLoading({title: '支付中'});
					
					let params = {};
					params.payOrderId = this.payOrderId;
					params.payType = this.payType;
					params.payWay = this.payWay;
					params.mark = this.markIndex;
					params.body = this.payTitle[this.payType];
					if (uni.getStorageSync('wanju_token')) {
						params.token = uni.getStorageSync('wanju_token')
					}
					let _this = this;
					_this.ajax(this.url.payOrder,"POST",params,function(res){
						if (_this.payWay == 1) {
							uni.hideLoading();
							uni.showToast({title: '支付成功'});
							setTimeout(() => {
							   _this.$emit("okPay");
							}, 1500);
						} else if (_this.payWay == 4) {
							// 检测是否为微信环境
							if (_this.isWeiXinLogin()) {
								// 在微信内，跳转到支付宝支付引导页
								// 将支付链接作为参数传递给引导页
								 _this.$emit("okPay");
								uni.navigateTo({
								  url: '/pages/guide/alipay-guide?payUrl=' + encodeURIComponent(res.msg)
								});
							} else {
								// 非微信环境，直接跳转支付
								// #ifdef H5
								window.location.href = res.msg;
								// #endif
								// #ifdef APP-PLUS
								// 2026-09-05 v2.1.8:APP逻辑层无window.location,收银台在APP内置webview页打开
								uni.navigateTo({ url: '/pages/web/pay?u=' + encodeURIComponent(res.msg) });
								// #endif
							}
						} else {
							_this.funcwechatReday(res.data);
						}
					});
				},
				cancel(){
					this.$emit("toCancel");
				},
				getBalance(){
					let _this = this;
					_this.ajax(_this.url.balance,"get",{},function(res){
						if(res.code == 200){
							_this.userBalance = res.data.toFixed(2);
							if (_this.userBalance > 0) {
								if (_this.payAmount > _this.userBalance) {
									_this.groupPayType = true;
									_this.groupReAmount = (_this.payAmount - _this.userBalance).toFixed(2);
									_this.groupNote = '可用余额为 ' + _this.userBalance + ' 元，需微信支付 ' + _this.groupReAmount + ' 元';
									_this.payWay = 2;
								} else {
									_this.balanceDisabled = false;
									_this.payWay = 1;
								}
							}
							uni.hideLoading();
						}
					});
				},
				//微信h5支付
				funcwechatReday(option) {
					// var that = this;
					if (typeof WeixinJSBridge == "undefined") {
						if (document.addEventListener) {
							document.addEventListener('WeixinJSBridgeReady', onBridgeReady(option), false);
						} else if (document.attachEvent) {
							document.attachEvent('WeixinJSBridgeReady', onBridgeReady(option));
							document.attachEvent('onWeixinJSBridgeReady', onBridgeReady(option));
						}
					} else {
						this.onBridgeReady(option);
					}
				},
				onBridgeReady(option) {
					var that = this;
					WeixinJSBridge.invoke('getBrandWCPayRequest', {
						"appId": option.appId, //公众号ID，由商户传入     
						"timeStamp": option.timeStamp, //时间戳，自1970年以来的秒数     
						"nonceStr": option.nonceStr, //随机串     
						"package": option.package,
						"signType": option.signType, //微信签名方式：     
						"paySign": option.paySign, //微信签名 
					},
					function(res) {
						uni.showToast({icon: 'none',title: res}); 
						if (res.err_msg == 'get_brand_wcpay_request:ok') {
							uni.showToast({icon: 'none',title: '支付成功'}); 
							let url = "/pages/chat/index";
							if (that.payType == 0 || that.payType == 2) {
								url = "/pages/wallet/index";
							} else if (that.payType == 1) {
								url = "/pages/demand/list";
							} else if (that.payType == 4) {
								url = "/pages/index/detail?id=" + that.markIndex;
							}
							uni.showLoading();
							setTimeout(() => {
								uni.hideToast();
								//关闭提示后跳转
								uni.redirectTo({
									url: url
								});
							  }, 800);
						}
						if (res.err_msg == 'get_brand_wcpay_request:cancel') {
							uni.showToast({icon: 'none',title: '取消支付'}); 
						}
						if (res.err_msg == 'get_brand_wcpay_request:fail') {
							uni.showToast({icon: 'none',title: '支付失败'}); 
						}
					});
				}
			}
		};
</script>

<style>
	uni-list-item_content-title{
		font-weight: bolder;
	}
	.active{
		background-color: #39b54a;
		color: white;
	}
	.panyment-price{
		text-align: center;
		font-size: 40rpx;
		margin-bottom: 30rpx;
	}
	.amount{
		font-size: 50rpx;
		margin-left: 10rpx;
		font-weight: bolder;
	}
	.default{
		background-color: #f6f7fd;
		color: black;
	}
	.popup-title{
		display: flex;
		padding: 30rpx;
	}
	.popup-title text{
		width: 33.3%;
	}
	.popup-title-text{
		font-weight: bolder;
		text-align: center;
	}
	.popup-ok-btn{
		color: #39b54a;
		font-weight: bolder;
		text-align: right;
	}
	.submit-pay{
		background-color: #fd2e54;
		margin: 80rpx 50rpx;
		font-size: 30rpx;
		font-weight: bolder;
		color: white;
		padding: 20rpx 0;
		border-radius: 10rpx;
		text-align: center;
	}
	.icon-image{
		width: 50rpx;
		height: 50rpx;
	}
	.panyment-title{
		font-size: 30rpx;
		text-align: center;
	}
	
	/* 2026-09-05 v2.1.12: 微信扫码支付弹层 */
	.qr-mask{
		position: fixed; left: 0; top: 0; right: 0; bottom: 0;
		background: rgba(0,0,0,0.55); z-index: 9999;
		display: flex; align-items: center; justify-content: center;
	}
	.qr-card{
		width: 580rpx; background: #ffffff; border-radius: 24rpx;
		padding: 40rpx 36rpx 30rpx; display: flex; flex-direction: column; align-items: center;
	}
	.qr-title{ font-size: 34rpx; font-weight: bolder; color: #222; }
	.qr-amount{ font-size: 44rpx; font-weight: bolder; color: #fd2e54; margin: 14rpx 0 20rpx; }
	.qr-img{ width: 400rpx; height: 400rpx; }
	.qr-steps{ display: flex; flex-direction: column; gap: 8rpx; margin: 22rpx 0 6rpx; }
	.qr-steps text{ font-size: 26rpx; color: #555; }
	.qr-done-btn{
		width: 100%; margin-top: 26rpx; background: #09bb07; color: #fff;
		font-size: 30rpx; font-weight: bolder; text-align: center;
		padding: 20rpx 0; border-radius: 14rpx;
	}
	.qr-cancel{ margin-top: 18rpx; font-size: 27rpx; color: #999; padding: 8rpx 30rpx; }
</style>