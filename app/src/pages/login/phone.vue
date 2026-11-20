<template>
    <view id="content-new" class="content">
		<view class="head-title">球域Ai</view>
		<view class="head-title" style="font-weight: 400;">绑定手机号</view>
        <view class="list">
        	<view class="list-call input-new" >
        		<image class="img" src="/static/icon/phone.png"></image> | 
        		<input class="biaoti" v-model="phoneno" type="number" maxlength="11" placeholder="请输入手机号" />
        	</view>
        	<view class="list-call input-new code-row">
        		<input class="biaoti code-input" v-model="code" type="number" maxlength="6" placeholder="请输入短信验证码" />
        		<view class="code-btn" :class="{ disabled: hasSend }" @tap="sendSmsCode">{{ msgCodeText }}</view>
        	</view>
        	
        	<view class="dlbutton" hover-class="dlbutton-hover" @tap="bindLogin()">
        		<text>确认</text>
        	</view>
        </view>
		
    </view>
</template>

<script>
	const app = getApp();
	export default {
		onShow(){},
		onUnload(){
			if (this.codeInterval) {
				clearInterval(this.codeInterval);
				this.codeInterval = null;
			}
		},
		data() {
			return {
				phoneno: '',
				code: '',
				hasSend: false,
				msgCodeText: '获取验证码',
				codeInterval: null
			};
		},
		methods: {
			sendSmsCode() {
				if (this.hasSend) return;
				if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phoneno))) {
					uni.showToast({ icon: 'none', title: '手机号不正确' });
					return;
				}
				var that = this;
				this.ajax(this.url.sendCode, "POST", { phone: this.phoneno, type: 1 }, function() {
					uni.showToast({ title: '验证码已发送' });
					var sec = 60;
					that.hasSend = true;
					that.msgCodeText = sec + 's';
					that.codeInterval = setInterval(function() {
						sec--;
						if (sec <= 0) {
							clearInterval(that.codeInterval);
							that.codeInterval = null;
							that.hasSend = false;
							that.msgCodeText = '重新获取';
						} else {
							that.msgCodeText = sec + 's';
						}
					}, 1000);
				});
			},
		    async bindLogin() {
				if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phoneno))) {
				     uni.showToast({
				        icon: 'none',
				        title: '手机号不正确'
				    });
				    return;
				}
				if (!this.code || !this.code.trim()) {
				    uni.showToast({
				        icon: 'none',
				        title: '请输入短信验证码'
				    });
				    return;
				}
				uni.showLoading();
				this.ajax(this.url.bindPhone,"POST",{phone: this.phoneno, code: this.code.trim()},function(resp){
					uni.showToast({
						title: "绑定手机号成功"
					});
					setTimeout(() => {
					  // #ifdef H5
					  window.location.href = "/#/pages/wallet/index";
					  // #endif
					  // #ifdef APP-PLUS
					  uni.switchTab({url: "/pages/wallet/index"});
					  // #endif
					}, 500);
				});
		    }
		}
	}
</script>

<style scoped>
	*:not(input, textarea) {
	  -webkit-touch-callout: none;
	  -webkit-user-select: none;
	}
	.content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		font-size: 15px;
		background-color: #fff;
		/* 2026-09-14: APP端垂直居中修复——不再依赖scoped的uni-page-body{height:100%}(APP不生效导致内容顶格"自动往上") */
		height: 100vh;
		box-sizing: border-box;
	}
	.head-title{
		font-size: 36rpx;
		font-weight: bolder;
		margin-left: 80rpx;
	}
	
	.list {
		display: flex;
		flex-direction: column;
		padding-left: 70upx;
		padding-right: 70upx;
	}
	.list-call{
		display: flex;
		width: 100%;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 100upx;
		color: #333333;
	}
	.list-call image{
		width: 34upx;
		height: 28upx;
	}
	.list-call .biaoti{
		flex: 1;
		text-align: left;
		font-size: 15px;
		line-height: 100upx;
		height: 100upx;
		margin-left: 16upx;
	}
	.uni-input-placeholder{
		color: #282828;
	}

	.dlbutton {
		color: #FFFFFF;
		font-size: 34upx;
		width:100%;
		height:80upx;
		background-image: linear-gradient(45deg, #fa436a 0%, #fa436a 99%, #fa436a 100%);
		box-shadow:0upx 0upx 13upx 0upx rgba(164,217,228,0.2);
		border-radius:50upx;
		line-height: 80upx;
		text-align: center;
		margin-left: auto;
		margin-right: auto;
		margin-top: 60upx;
	}
	.dlbutton-hover {
		background:linear-gradient(-90deg,rgba(63,205,235,0.9),rgba(188,226,158,0.9));
	}
	
	
	.container {
	    padding: 0 60rpx;
	}
	
	/* uni-page-body高度链在APP端不可靠(scoped选择器不命中),高度改由.content的100vh承担 */
	#content-new{
		height: 100vh;
	}
	#content-new .data-v-b237504{
		/* background: url('../../static/images/bg/dlbg.png'); */
	}
	.list-call image.img{
		margin-left: 15px;
		margin-right: 10px;
		width: 17px!important;
		height: 20px!important;
	}
	.code-row{
		padding: 0 12px 0 18px;
		box-sizing: border-box;
	}
	.code-input{
		margin-left: 0 !important;
	}
	.code-btn{
		font-size: 13px;
		color: #2f7dcb;
		padding: 6px 12px;
		border-radius: 16px;
		background: rgba(47, 125, 203, 0.1);
		white-space: nowrap;
	}
	.code-btn.disabled{
		color: #999;
		background: #f2f2f2;
	}
	.input-new{
		margin-top: 20px;
		border: 1px solid rgb(126 126 126);
		border-radius: 25px;
		background: white;
	}
	
	.dlbutton{
		background-image: none!important;
		background-color: #68AFEF!important;
	}
	#duigou{
		width: 10px;
		height: 5px;
		position: absolute;
		left:56px;
	}
</style>