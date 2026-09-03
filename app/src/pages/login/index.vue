<template>
    <view id="content-new" class="content">
        <view class="btns-item">
			<view class="login-text">登录或注册球域Ai</view>
			<view class="btn-item" @tap="toWxLogin" v-if="iswxLogin">
				<image mode="aspectFill" class="weixin-icon" src="/static/icon/weixin.png"></image>
				<text>微信账号登录</text>
			</view>
			<view class="btn-item" @tap="toLogin">
				<text>手机号登录/注册</text>
			</view>
			<view class="recharge-desc" v-if="iswxLogin">
				<checkbox-group @click="changeChecked">
					<label>
						<checkbox value="bb" :checked="checkboxMark" style="transform: scale(0.8)"  />
						已知晓并同意<text style="color: #6ea2ff" @click="tapNav('/pages/news/index?id=7')">《用户协议》</text>
					</label>
				</checkbox-group>
			</view>
		</view>
		
    </view>
</template>

<script>
const app = getApp();
export default {
    data() {
        return {
           iswxLogin: false,
		   checkboxMark: true
        };
    },
    onLoad: function (options) {
       if (this.isWeiXinLogin()) {
		   this.iswxLogin = true;
		   var code = this.getUrlCodeParam('code');
		   if (null != code && "" != code) {
			    this.wxLogin(code)
		   }
	   }
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
       isWeiXinLogin() {
           var ua = window.navigator.userAgent.toLowerCase();
           if (ua.match(/MicroMessenger/i) == 'micromessenger') {
               return true; // 微信中打开
           } else {
               return false; // 普通浏览器中打开
           }
       },
	   toWxLogin: function() {
				// let t = this.getUrlCodeParam();
				let code = this.getUrlCodeParam('code');
				let n = window.location.href.replace("#", "virtually");
				null == code || "" === code ? window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb4d3434afbdf00c2&redirect_uri=" + encodeURIComponent(n) + "&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect" : this.wxLogin(code)
			},
			wxLogin: function(t) {
				this.ajax(this.url.wxLogin,"POST",{code: t},function(res){
					uni.setStorageSync("wanju_token",res.data.token)
					uni.setStorageSync("wanju_nickName",res.data.phone)
					uni.setStorageSync("wanju_avatarUrl",res.data.pic)
					uni.setStorageSync('wanju_user_op',res.data.openid);
					if (res.data.phone == null || res.data.phone == '') {
						uni.navigateTo({
							url: "/pages/login/phone"
						})
					} else {
						uni.showToast({
							title: "登录成功"
						}),
						setTimeout(() => {
						  window.location.href = "/#/pages/chat/index";
						}, 500);
					}
				})
			},
			toLogin: function() {
				uni.navigateTo({
					url: "/pages/login/login"
				})
			},
			getUrlCodeParam: function(name) {
				var after = window.location.hash.split("?")[1];
				if(after){
				 var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
				 var r = after.match(reg);
				 if(r != null){
					return  decodeURIComponent(r[2]);
				 } else {
					return null;
					}
				}
			}
		}
    }
</script>
<style>
	page {
	    background-color: #fff;
	}
	.weixin-icon{
		width: 60rpx;
		height: 60rpx;
		vertical-align: middle;
		margin-right: 8rpx;
	}
	.container {
	    min-height: 100%;
	    padding-bottom: 100rpx;
	}
	.btns-item{
	    position: fixed;
	    bottom: 40%;
	    left: 52px;
	    right: 52px;
	}
	.login-text {
	    text-align: center;
	    width: 100%;
	    font-size: 20px;
	}
	.btn-item {
	    font-size: 16px;
	    font-weight: bolder;
	    height: 52px;
	    width: 100%;
	    line-height: 52px;
	    background-color: #68afef;
	    border-radius: 26px;
	    text-align: center;
	    color: #fff;
	    margin-top: 31px;
	}
	.xieyi text{
		font-size: 26upx;
		margin-left: 15upx;
		margin-right: 15upx;
	}
	.recharge-desc{
		font-size: 26rpx;
		text-align: center;
		margin-top: 50rpx;
		color: #9c9d9d;
	}
</style>

