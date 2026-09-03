<template>
	<view class="container">
		<view style="height: 200rpx;">&nbsp;</view>
		<view class="recharge-container">
			<view class="recharge-title" style="margin-top: -150rpx;">
				<image src="/static/money.png" style="width: 200rpx;height: 200rpx;"></image>
				<text style="font-size: 40rpx;font-weight: bolder;">余额不足，请充值</text>
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
				</view>
			</view>
			<view class="recharge-btn" @tap="pay">确认支付</view>
			<view class="recharge-desc">
				<checkbox value="bb" checked="" style="transform: scale(0.7)" />
				充值即同意<text style="color: #385dd6;" @click="tapNav">《充值服务协议》</text>
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
			let param = {};
			param.pid = this.balanceId;
			param.amount = this.rechargeList[this.balanceId-1].price;
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
