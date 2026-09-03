<template>
    <view id="content-new" class="content">
		<view class="head-title">球域Ai</view>
		<view class="head-title" style="font-weight: 400;">绑定手机号</view>
        <view class="list">
        	<view class="list-call input-new" >
        		<image class="img" src="/static/icon/phone.png"></image> | 
        		<input class="biaoti" v-model="phoneno" type="text" maxlength="11" placeholder="请输入手机号" />
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
		onShow(){
			var that = this
		},
		data() {
			return {
				phoneno:'',
			};
		},
		methods: {
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
				uni.showLoading();
				var that = this;
				
				this.ajax(this.url.bindPhone,"POST",{phone: this.phoneno},function(resp){
					uni.showToast({
						title: "绑定手机号成功"
					});
					setTimeout(() => {
					  window.location.href = "/#/pages/chat/index";
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
		justify-content:center;
		font-size: 15px;
		background-color: white;
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
	
	uni-page-body{
		height: 100%;  
		background: center;
	}
	.content{
		background-color: transparent !important;
	}
	#content-new{
		height: 100%;  
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