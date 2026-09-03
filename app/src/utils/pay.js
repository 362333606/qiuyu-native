// const WXAPI = require('@/miniprogram_npm/apifm-wxapi');

/**
 * type: order 支付订单 recharge 充值 paybill 优惠买单
 * data: 扩展数据对象，用于保存参数
 */
function wxpay(type, money, orderId, redirectUrl, data) {
	const postData = {
		token: uni.getStorageSync('bestpw-Token'),
		money: money,
		remark: '在线充值'
	};
	if (type === 'order') {
		postData.remark = '支付订单 ：' + orderId;
		postData.nextAction = {
			type: 0,
			id: orderId
		};
	}
	if (type === 'paybill') {
		postData.remark = '优惠买单 ：' + data.money;
		postData.nextAction = {
			type: 4,
			uid: uni.getStorageSync('uid'),
			money: data.money
		};
	}
	postData.payName = postData.remark;
	if (postData.nextAction) {
		postData.nextAction = JSON.stringify(postData.nextAction);
	}
	WXAPI.wxpay(postData).then(function(res) {
		if (res.code == 0) {
			// 发起支付
			funcwechatReday(res.data)
		} else {
			uni.showModal({
				title: '出错了',
				content: JSON.stringify(res),
				showCancel: false
			});
		}
	});
};
//微信h5支付
function funcwechatReday(option) {
		// var that = this;
		if (typeof WeixinJSBridge == "undefined") {
			if (document.addEventListener) {
				document.addEventListener('WeixinJSBridgeReady', onBridgeReady(option), false);
			} else if (document.attachEvent) {
				document.attachEvent('WeixinJSBridgeReady', onBridgeReady(option));
				document.attachEvent('onWeixinJSBridgeReady', onBridgeReady(option));
			}
		} else {
			onBridgeReady(option);
		}
	};
function onBridgeReady(option) {
		// var that = this;
		WeixinJSBridge.invoke('getBrandWCPayRequest', {
				"appId": 'wx5a64ae4cbfea3f43', //公众号ID，由商户传入     
				"timeStamp": option.timeStamp, //时间戳，自1970年以来的秒数     
				"nonceStr": option.nonceStr, //随机串     
				"package": "prepay_id="+option.prepayId,
				"signType": option.signType, //微信签名方式：     
				"paySign": option.sign, //微信签名 
			},
			function(res) {
				if (res.err_msg == 'get_brand_wcpay_request:ok') {
					this.$commonjs.tipshow(that, '支付成功', 'success')
					uni.showToast({
						title: '支付成功'
					});
					uni.redirectTo({
						url: '../../pay/success/success?amount=' + that.amount
					});
				}
				if (res.err_msg == 'get_brand_wcpay_request:cancel') {
					this.$commonjs.tipshow(that, '用户取消', 'error')
				}
				if (res.err_msg == 'get_brand_wcpay_request:fail') {
					this.$commonjs.tipshow(that, '支付失败', 'error')
				}
			});
	}
	module.exports = {
		wxpay: wxpay
	};
