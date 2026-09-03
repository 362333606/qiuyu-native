<style>
	page {
		background-image: url(https://oss.bestpw.cn/2024-07-04/faa3215e-f273-421e-a313-27f8649ad109.jpeg);
		background-size: 100% 100%;
	}
	uni-page-body{
		height: 100%;  
		background: center;
	}
		
	.dlbutton{
		width: 150px!important;
		background-image: none!important;
		background-color: #68AFEF!important;
	}
	.input-new{
		margin-top: 20px;
		border: 0.5rpx solid #83b1f2;
		border-radius: 25px;
	}
	.uni-input-placeholder{
		color: #282828;
	}
	
	.input-new .img{
		margin-right: 10px;
	}
	.code-new{
		background-color: #68AFEF!important;
		width: 85px;
		margin-right: 10px;
	}
	.content{
		padding-top: 50px;
		height: 100%;  
	}
	.content{
		background-color: transparent !important;
	}
	.xieyi text{
		font-size: 26upx;
		margin-left: 15upx;
		margin-right: 15upx;
	}
	.recharge-desc{
		font-size: 26rpx;
		text-align: center;
		margin-top: 30rpx;
		color: #9c9d9d;
	}
</style>
<template>
	<view class="content">
		<view class="header" @click="upLoadPhoto()">
			<image :src="imagebaseurl + form.avatarUrl"></image>
		</view>
		<view class="list">
			<view class="list-call input-new">
				<input class="biaoti" v-model="form.phone" type="number" maxlength="11" placeholder=" 电话号码" />
			</view>
			<view class="list-call input-new ">
				<input class="biaoti"  placeholder=" 验证码" v-model="form.code" />
				<view  @click="getCodTime">
					<view class="get-code-text row-center  code-new" >{{msgCodeText}}</view>
				</view>
			</view>
			<view class="list-call input-new">
				<input class="biaoti" v-model="form.password" type="text" maxlength="15" placeholder=" 密码" :password="!showPassword" />
				<image class="img" :src="showPassword?'/static/images/op.png':'/static/images/cl.png'" @tap="display"></image>
			</view>
			<view class="list-call input-new">
				<input class="biaoti" v-model="form.confirmPassword" type="text" maxlength="15" placeholder=" 再次输入密码" :password="!hide" />
				<image class="img" :src="hide?'/static/images/op.png':'/static/images/cl.png'" @tap="hide_two"></image>
			</view>
			<view class="list-call input-new">
				<input class="biaoti" v-model="form.inviteCode" type="text" maxlength="20" placeholder="邀请码(非必填)" />
			</view>
		</view>
		
		<view class="dlbutton" hover-class="dlbutton-hover" @tap="postReg">
			<text>注册</text>
		</view>
		
		<view class="recharge-desc">
			<checkbox-group @click="changeChecked">
				<label>
					<checkbox value="bb" :checked="checkboxMark" style="transform: scale(0.8)"  />
					已知晓并同意<text style="color: #6ea2ff" @click="tapNav('/pages/news/index?id=7')">《用户注册协议》</text>
				</label>
			</checkbox-group>
		</view>
		
		<view class="xieyi" style="margin-top: 60rpx;">
			<!-- <navigator url="forget" open-type="navigate">忘记密码</navigator>
			<text>|</text> -->
			<navigator url="/pages/login/login" open-type="navigate" style="color: #6ea2ff;">已有账号，立即登录</navigator>
		</view>
		
	</view>
</template>

<script>
	const app = getApp();
	export default {
		onLoad(options){
			if (options.inviteCode) {
				this.form.inviteCode = options.inviteCode;
			}
			// if(this.isWeiXinLogin()) {
			// 	this.getCode();
			// }
		},
		onUnload(){
			clearInterval(js)
			this.second = 0;
		},
		components: {
		},
		data() {
			return {
				form: {
					avatarUrl:'comm/images/game_ai_logo.png',
					phone:'',
					code:'',
					password:'',
					confirmPassword:'',
					inviteCode:''
				},
				xieyi:false,
				showPassword:false,
				hide:false,
				msgCodeText:'获取验证码',
				hasSend:false,
				checkboxMark: true,
				imagebaseurl: this.ossUrl,
			};
		},
		computed:{
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
			display() {
			    this.showPassword = !this.showPassword
			},
			hide_two:function () {
				this.hide = !this.hide
			} ,
			
			/**
			   * 获取倒计时
			   */
			getCodTime(){
				if(this.form.phone ==''){
					uni.showToast({
						title:"请输入手机号",
						icon:"none"
					})
					return;
				}
				if(this.hasSend){
					return;
				}
				let _this = this;
				_this.ajax(_this.url.sendCode,"POST",{"phone": _this.form.phone},function(resp){
					uni.showToast({title: '验证码已发送'});
					let code=60
					_this.msgCodeText=code + ' S'
					_this.hasSend=true
					_this.codeInterval=setInterval(()=>{
					  code--
					  _this.msgCodeText=code+ ' S'
					  if(code<0){
					    clearInterval(_this.codeInterval)
					    _this.msgCodeText='重新发送'
					    _this.hasSend=false
					  }
					},1000)
				})
			  },

			postReg(){
				if (this.form.phone=="") {
				    uni.showToast({
				        icon: 'none',
				        title: '请输入手机号'
				    });
				    return;
				}
				if(this.form.code==''){
					uni.showToast({
						title:'请输入验证码',
						icon:'none'
					});
					return;
				}
				if(this.form.password==''){
					uni.showToast({
						title:'请输入密码',
						icon:'none'
					});
					return;
				}
				if(this.form.confirmPassword==''){
					uni.showToast({
						title:'请再次输入密码',
						icon:'none'
					});
					return;
				}
				if(this.form.password != this.form.confirmPassword){
					uni.showToast({
					    icon: 'none',
					    title:'两次密码不一样'
					});
					return;
				}
				uni.showLoading();
				this.form.openid = uni.getStorageSync('game_ai_openid');
				this.ajax(this.url.register,"POST",this.form,function(res){
					uni.showToast({title: '注册成功'});
					setTimeout(() => {
					   uni.navigateTo({
					   	url:'/pages/login/login'
					   })
					}, 1500);
				});
			},
			upLoadPhoto(){
				let _this = this;
				uni.chooseImage({
				    count: 1,
				    sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
				    sourceType: ['album'], //从相册选择
				    success: function(res) {
						const tempFilePaths = res.tempFilePaths[0];
						if(tempFilePaths.size > 3*1024*1024){
							uni.showToast({title:'图片大小不得高于3M',icon:"none"})
							return;
						}
						uni.showLoading({
							title: "上传中"
						});
						uni.uploadFile({
							url: _this.uploadUrl + '/upload',
							filePath: tempFilePaths,
							name: 'file',
							success: (res) => {
								uni.hideLoading();
								let data = JSON.parse(res.data);
								if(data.code == 200){
									_this.form.avatarUrl = _this.imagebaseurl + data.msg;
									uni.showToast({icon: 'none',title: '头像上传成功'}); 
								}else {
									uni.showToast({icon: 'none',title: data.msg}); 
								}
							}
						});
					}
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	*:not(input, textarea) {
	  -webkit-touch-callout: none;
	  -webkit-user-select: none;
	}
	.content {
		flex-direction: column;
		justify-content:center;
		background-color: white;
	}
	.header {
		width:200upx;
		height:200upx;
		background:white;
		border-radius:50%;
		margin-top: 30upx;
		margin-left: auto;
		margin-right: auto;
	}
	.header image{
		border-radius:50%;
		width: 100%;
		height: 100%;
	}
	
	.list {
		display: flex;
		flex-direction: column;
		padding-top: 50upx;
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
		padding-left: 20upx;
	}
	.list-call image{
		width: 34upx;
		height: 28upx;
	}
	.list-call .biaoti{
		flex: 1;
		text-align: left;
		font-size: 15px;
		height: 100upx;
		line-height: 100upx;
		margin-left: 16upx;
	}
	.get-code-text{
		background: #fa436a;
		padding: 6px 12px;
		color: #fff;
		border-radius: 25px;
		font-size: 12px;
		text-align: center;
	}
	.yzm {
		color: #FF7D13;
		font-size: 24upx;
		line-height: 64upx;
		padding-left: 10upx;
		padding-right: 10upx;
		width:auto;
		height:64upx;
		border:1upx solid #FFA800;
		border-radius: 50upx;
	}
	.yzms {
		color: #999999 !important;
		border:1upx solid #999999;
	}
	.dlbutton {
		color: #FFFFFF;
		font-size: 34upx;
		width:600upx;
		height:80upx;
		background-image: linear-gradient(45deg, #fa436a 0%, #fa436a 99%, #fa436a 100%);
		box-shadow:0upx 0upx 13upx 0upx rgba(164,217,228,0.2);
		border-radius:50upx;
		line-height: 80upx;
		text-align: center;
		margin-left: auto;
		margin-right: auto;
		margin-top: 50upx;
	}
	.dlbutton-hover {
		background:linear-gradient(-90deg,rgba(63,205,235,0.9),rgba(188,226,158,0.9));
	}
	.suggest{
		color: #DB0112;
		padding:20px 30px;
		line-height: 25px;
		font-size: 16px;
	}
	.suggest span{
		color: #666;
	}
	.xieyi{
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		font-size: 30upx;
		margin-top: 40upx;
		color: #FFA800;
		text-align: center;
		height: 40upx;
		line-height: 40upx;
	}
	.xieyi image{
		width: 40upx;
		height: 40upx;
	}
	
	.mask-style{
		position: fixed;
		top: 0;
		left:0;
		width: 100%;
		height: 100%;
		z-index:888;
		background-color: rgba(0, 0, 0, 0.6);
	}
	.btn{
		height: 120rpx;
		display: flex;
		flex-direction: row;
		border-top:1px solid #eeeeee;
		.cancel{
			display: flex;
			flex: 1;
			justify-content: center;
			align-items: center;
			margin: 10px 10px;
			border: 1px solid #eeeeee;
			border-radius: 25px;
		}
		.confirm{
			display: flex;
			flex: 1;
			justify-content: center;
			align-items: center;
			margin: 10px 10px;
			background-color: #FFC107;//DB0112
			color: #fff;
			border-radius: 25px;
		}
	}
	.wxbox{
		position: fixed;
		top:30%;
		z-index: 998;
		width:80%;
		left:10%;
		background-color: #fff;
		border-radius:20rpx;
		.close{
			position: absolute;
			top:10px;
			right:10px;
			z-index: 999;
			text-align: center;
		}
		.weixin{
			font-size: 17px;
			padding: 15px 0;
			color: #333333;
			text-align: center;
			border-bottom: 1px solid #f5f5f5;
			
		}
		.tips{
			padding:10rpx 25rpx;
			font-size:15px;
			color:#666;
			display: flex;
			.left-title{
				width: 80px;
			}
			.right-name{
				flex: 1;
			}
		}
	}
</style>
