<template>
	<view class="container">
		<view style="height: 200rpx;">&nbsp;</view>
		<view class="recharge-container">
			<view class="recharge-title" style="margin-top: -150rpx;">
				<image src="/static/money.png" style="width: 200rpx;height: 200rpx;"></image>
				<text style="font-size: 40rpx;font-weight: bolder;">账户充值</text>
			</view>
			<!-- <view class="recharge-head">
				<text class="balance-info">余额：<text>{{balance}}</text></text>
			</view> -->
			<view class="recharge-list">
				<view class="recharge-item" 
				v-for="(item,index) in rechargeList" 
				@tap="balanceId = item.id"
				:class="balanceId === item.id ? 'active' : 'default'">
					<view class="recharge-price">
						<text style="font-size: 24rpx;">¥</text>
						<text>{{item.price}}</text></view>
					<view class="recharge-give-price" v-if="giveOf(item.price)">送{{giveOf(item.price)}}元</view>
				</view>
			</view>
			<view class="recharge-btn" @tap="pay">确认支付</view>
			<view class="recharge-desc">
				<checkbox value="bb" checked="" style="transform: scale(0.7)" />
				赠送金额可用于站内消费，不可提现。充值即同意<text style="color: #385dd6;" @click="tapNav">《充值服务协议》</text>
			</view>
			
			
		</view>
		<view class="show-popup" v-if="isPay">
			<view class="popup-mask" @click="closePay"></view>
			<view class="popup-contents">
				<payment @toCancel="closePay" @okPay="okPay" :payTypeId="0" :payOrderId="payOrderId" :payAmount="payAmount"></payment>
			</view>
		</view>
	</view>
</template>

<script>
//index.js
//获取应用实例
import payment from '@/components/payment';
export default {
	components: {
		payment
	},
    data() {
        return {
            wxlogin: false,
            favList: '',
            loadingMoreHidden: false,
			rechargeList:[],
			balance: 0,
			balanceId: '',
			isPay:false,
			payOrderId:0,
			payAmount:0
        };
    },
    onShow: function () {
        this.getList();
		// this.initBalance();
    },
    methods: {
		giveOf(price) {
			// 2026-11-17 张总定：充值赠送档位（与服务器 sys_dict id=33 一致，赠送不可提现）
			return ({2000: 200, 5000: 750, 10000: 2000, 20000: 4000})[parseInt(price)] || 0;
		},
		tapNav() {
		    uni.navigateTo({
		        url: '/pages/news/index?id=14'
		    });
		},
		closePay: function() {
			this.isPay = false;
		},
		okPay: function() {
			this.isPay = false;
			// this.initBalance();
		},
		async initBalance() {
			const res = await WXAPI.balance();
			if (res.code == 200) {
			    this.balance = res.data.toFixed(2);
			} 
		},
        afterAuth(e) {
            this.setData({
                wxlogin: true
            });
            this.getList();
        },

        closeAuth() {
            uni.navigateBack();
        },
		pay() {
			var _that = this;
			if (this.balanceId == '') {
				uni.showToast({icon: 'none',title: '请选择充值套餐'}); 
			    return false;
			}
			var curPkg = this.rechargeList.find(function(x){ return String(x.id) === String(_that.balanceId); });
			if (!curPkg) {
				uni.showToast({icon: 'none',title: '套餐已更新，请重新选择'});
				return false;
			}
			let param = {};
			param.pid = this.balanceId;
			param.amount = curPkg.price;
			_that.ajax(_that.url.balanceDeposit, "post", param, function(res) {
				_that.payOrderId = res.data.id;
				_that.payAmount = res.data.balance;
				_that.isPay = true;
			});
		},
        getList() {
			var _that = this;
			_that.ajax(_that.url.rechargePackage, "GET", null, function(resp) {
				var packageArray = []
				var array = resp.data;
				for(var key in array){
					packageArray.push({
						"id": key,
						"price": array[key],
					})
				}
			    _that.rechargeList = packageArray;
			});
        }
    }
};
</script>
<style>
@import './index.css';
</style>
