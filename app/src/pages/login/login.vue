<style>
	page {
	    font-size: 32rpx;
		background-image: url(https://oss.bestpw.cn/2024-07-04/faa3215e-f273-421e-a313-27f8649ad109.jpeg);
		background-size: 100% 100%;
	}
	uni-page-body{
		height: 100%;  
		background: center;
	}
	.content{
		background-color: transparent !important;
	}
	#content-new{
		height: 100%;  
		padding-top: 50%;
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
	.input-new{
		margin-top: 20px;
		border: 1px solid rgb(126 126 126);
		border-radius: 25px;
		background: white;
	}
	.header{
		all: unset;
	}
	.header{
		border-radius: 0px !important;
		width: 100%!important;
		background-color: inherit!important;
	}
	.#hy{
		all: unset;
	}
	#hy{
		margin-left: 50px!important;
		width: 120px!important;
		height: 50px;
		border-radius: 0px!important;
	}
	.getcode{
		margin-right: 10px;
		width: 105px;
		border: none;
		border-radius: 20px;
		background-color: #68AFEF;
		font-size: 13px;
		color: #fff;
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
<template>
	<view class="" id="content-new">
		<view class="header">
			<image src="/static/hy.png" id="hy"></image>
		</view>
		<view class="list">
			<view class="list-call input-new" >
				<image class="img" src="/static/icon/phone.png"></image> | 
				<input class="biaoti mount-family" v-model="phoneno" type="text" maxlength="11" placeholder="请输入手机号" />
			</view>
			<view class="list-call input-new">
				<image class="img" src="/static/icon/password.png" style="width: 23px !important;margin-right: 5px;"></image> |
				<input class="biaoti mount-family" v-model="password" type="text" maxlength="32" placeholder="请输入密码" password="true" />
			</view>
			<view class="dlbutton" hover-class="dlbutton-hover" @tap="bindLogin()">
				<text>登录</text>
			</view>
		</view>
		
		<view class="recharge-desc">
			<checkbox-group @click="changeChecked">
				<label>
					<checkbox value="bb" :checked="checkboxMark" style="transform: scale(0.8)"  />
					已知晓并同意<text style="color: #6ea2ff" @click="tapNav('/pages/news/index?id=7')">《用户协议》</text>和<text style="color: #6ea2ff" @click="tapNav('/pages/news/index?id=8')">《隐私协议》</text>
				</label>
			</checkbox-group>
		</view>
		
		<view class="xieyi">
			<!-- <navigator url="./findPassword" open-type="navigate" style="color: #6ea2ff;">忘记密码</navigator> -->
			<!-- <text>|</text> -->没有账号 ？
			<navigator url="/pages/register/register" open-type="navigate" style="color: #6ea2ff;"> 创建账户</navigator>
		</view>
		
		<!-- <view class="xieyi">
			无法登录 ？
			<navigator url="./findPassword" open-type="navigate" style="color: #6ea2ff;">找回密码</navigator>
		</view> -->
		
	</view>
</template>

<script>
	const app = getApp();
	export default {
		onShow(){
			var that = this
		},
		data() {
			return {
				phoneno:'',
				password:'',
				checkboxMark: false
			};
		},
		methods: {
			changeChecked(){
				this.checkboxMark = !this.checkboxMark;
			},
			tapNav(url) {
			    uni.navigateTo({
			        url: url
			    });
			},
		    async bindLogin() {
				// 手机号正则
				if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phoneno))) {
				     uni.showToast({
				        icon: 'none',
				        title: '手机号不正确'
				    });
				    return;
				}
				if (this.phoneno=="") {
				    uni.showToast({
				        icon: 'none',
				        title: '请输入登录手机号'
				    });
				    return;
				} 
				// 密码正则
		        if (this.password=='') {
		            uni.showToast({
		                icon: 'none',
		                title: '请输入登录密码'
		            });
		            return;
		        } 
				if (!this.checkboxMark) {
					uni.showToast({
					    icon: 'none',
					    title: '请确认阅读并同意《用户协议》和《隐私协议》'
					});
					return;
				}
				uni.showLoading();
				var that = this;
				this.ajax(this.url.login,
				"POST",{
					"phone": this.phoneno,
					"password": this.password,
				},function(resp){
					uni.showToast({title: '登录成功'}); 
					let token = resp.data.token
					uni.setStorageSync("wanju_token",token)
					uni.setStorageSync("wanju_nickName",resp.data.phone)
					uni.setStorageSync("wanju_avatarUrl",resp.data.pic)
					uni.setStorageSync('wanju_user_op',resp.data.openid);
					// uni.removeStorageSync('game_notice1_ok');
					setTimeout(() => {
					   uni.switchTab({
					   	url: '/pages/chat/index'
					   });
					}, 500);
				})
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
		justify-content:center;
		font-size: 15px;
		background-color: white;
	}
	.header {
		width:160upx;
		height:120upx;
		background:#f5f6f7;
		box-shadow:0upx 12upx 13upx 0upx f5f6f7;
		border-radius:50%;
		margin-left: auto;
		margin-right: auto;
	}
	.header image{
		width:161upx;
		height:161upx;
		border-radius:50%;
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
	.xieyi{
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		font-size: 28upx;
		margin-top: 60upx;
		color: #999;
		text-align: center;
		height: 40upx;
		line-height: 40upx;
	}
	.xieyi text{
		font-size: 24upx;
		margin-left: 15upx;
		margin-right: 15upx;
	}
	.recharge-desc{
		font-size: 24rpx;
		text-align: center;
		margin-top: 60rpx;
		color: #9c9d9d;
	}
</style>