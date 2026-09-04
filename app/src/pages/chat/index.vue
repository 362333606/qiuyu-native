<template>
	<view class="goods-container ">
		<view class="qiuyu-statusbar"></view>
		<!-- 自定义导航栏 -->
		<view class="gc-head">
			<view class="gc-head-title"  @click="showDrawer()">
				<uni-icons type="bars" size="30"></uni-icons>
				<text class="badge" v-if="unReadCount > 0">{{unReadCount}}</text>
			</view>
			<view class="gc-head-img" @click="menuToggle('top')">
				<text>新对话(模型切换)</text>
				<image src="/static/icon/up.png" class="title-up-icon" style="width: 24rpx;height: 24rpx;"></image>
				<!-- <uni-icons type="up" size="20" style="margin-left: 6rpx;"></uni-icons> -->
			</view>
			<view class="gc-post-btn" style="text-align: right" @click="serveToggle">
				<!-- <uni-icons type="headphones" size="30"></uni-icons> -->
				<image src="/static/icon/rengong.png" class="title-up-icon" style="width: 50rpx;height: 50rpx;"></image>
			</view>
		</view>
		<view style="text-align: center;margin-top: 200rpx;padding: 70rpx;">
			<image src="/static/logo.jpg"  style="width: 200rpx;height: 200rpx;"></image>
			<view style="font-size: 36rpx;font-weight: bolder;margin-bottom: 10rpx;margin-top: 20rpx;">嗨 !我 是 球 域 Ai</view>
			<view style="color: #808080;font-weight: bolder;">专注体育赛事智能Ai预测</view>
			<view style="color: #808080;font-weight: bolder;">足球，篮球，电竞</view>
			<view style="margin-top: 10rpx;color: #808080;font-weight: bolder;">预测就交给我吧~</view>
		</view>
		
		<uni-drawer ref="showLeft" mode="left" :width="320">
			
			<view class="message-list" style="height: 88%;">
				<scroll-view scroll-y style="height: 100%;"  @scrolltolower="loadMore">
					<view class="message-item" @tap="toDetail(item.id, item.status)" v-for="(item, index) in projectList" :key="index">
						<view class="message-time">
							<text class="mount-family">{{item.createDate}}</text>
						</view>
						<view class="message-item-content">
							<view class="message-item-head">
								<view>
									<image src="/static/logo-simple.png"></image>
								</view>
								<view class="message-item-title">{{item.title}}</view>
								<view class="message-item-head-info" v-if="item.status == 1">查看详情></view>
							</view>
							<view class="message-item-bottom">
								<text v-if="item.status == 0">AI正在解析中...</text>
								<text v-if="item.status == 1">球赛解析已完成，请及时查看！</text>
								<small class="model-name">{{item.modelName}}</small>
							</view>
						</view>
					</view>
					<view class="message-item" v-if="projectList.length == 0">
						<view class="message-item-content">
							<view class="message-item-head">
								<view>
									<image src="/static/logo-simple.png"></image>
								</view>
								<view class="message-item-title">暂无预测记录</view>
							</view>
							<view class="message-item-bottom">
								<text>球域Ai，专注体育赛事智能Ai预测</text>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
			<view class="login-botton" style="display: flex;width: 100%;align-items: center;box-sizing: border-box;">
				<view style="flex-grow: 1" @tap="toLogin()" v-if="!isLogin">
					<image src="/static/my-logo.png"></image>
					<div class="now-login" style="height: 50px;line-height: 50px;display: inline-block;vertical-align: top;">立即登录</div>
				</view>
				<view style="flex-grow: 1" v-else>
					<image :src="imagebaseurl + userDetail.avatarUrl" mode="widthFix" class="user-photo"></image>
					<div class="now-login" style="display: inline-block;">
						<text class="mount-family">{{userDetail.name}}</text><br/>
						<text style="font-size: 30rpx;color: #ddd;" @click="logout">退出登录</text>
					</div>
					
				</view>
				<!-- <view style="flex-grow: 1;" @tap="toPage('','/pages/wallet/index')" v-if="isLogin">
					<uni-icons type="more-filled" size="30" style="float: right;"></uni-icons>
				</view> -->
			</view>
		</uni-drawer>
		
		<view class="post-menu">
			<view class="upload-img-list">
				<view class="upload-img-item" v-for="(item, index) in imgFileNames" :key="index">
					<uni-icons type="image-filled" size="20"></uni-icons>
					<text>{{item}}</text>
					<uni-icons class="img-remove-icon" type="close" size="25" @tap="removeImgFile(index)"></uni-icons>
				</view>
			</view>
			<view class="uni-textarea">
				<textarea v-model="inputVal" class="mount-family" placeholder="给球域Ai发送消息" maxlength="120" />
			</view>
			<view class="chat-botton">
				<view class="chat-input-tags" style="flex-grow: 1;">
					<view class="chat-input-tags-item" @tap="tagVal(item.title)" v-for="(item, index) in hotWords" :key="index">
						<image :src="imagebaseurl + item.img"
							style="width: 36rpx;height: 36rpx"></image>
						<text>{{item.title}}</text>
					</view>
				</view>
				
				<view class="chat-botton-option" style="flex-grow: 1;text-align: center;">
					
					<uni-tooltip placement="top">
						<template #content>
							<text>添加赛事图片</text>
							<image src="/static/icon/image.png"  
							style="width: 40rpx;height: 40rpx;vertical-align: middle;margin-left: 10rpx;"></image>
						</template>
						<uni-icons type="plusempty" size="30" @tap="upLoadPhoto"></uni-icons>
					</uni-tooltip>
				</view>
				
				<view class="chat-botton-option" style="flex-grow: 1;text-align: center;" @tap="postChat">
					<uni-icons type="paperplane-filled" size="30"></uni-icons>
				</view>
			</view>
		</view>
		<uni-popup ref="popup" background-color="#fff">
			<view class="popup-content">
				<image :src="imagebaseurl + customerServiceImg" mode="widthFix"></image>
			</view>
		</uni-popup>
		
		<uni-popup ref="modelPopup" class="model-content" background-color="#fff" type="top">
			<view class="menu-popup-content">
				<uni-list :border="false">
					<uni-list-item :title="item.title" :note="item.info" :thumb="imagebaseurl + item.logo" thumbSize="sm"
					clickable @click="changeModelType(item)" v-for="(item, index) in modelList" :key="index">
						<template v-slot:footer>
							<uni-icons type="checkbox-filled" size="24" v-show="modelType == item.id"></uni-icons>
						</template>
					</uni-list-item>
				</uni-list>
			</view>
		</uni-popup>
		
		<uni-popup ref="servePopup" class="serve-content" background-color="#fff" type="top">
			<view class="menu-popup-content">
				<uni-list :border="false">
					<uni-list-item :thumb="imagebaseurl + item.img" @click="serveChange(item.link)"
					:title="item.title" clickable v-for="(item, index) in serveList" :key="index">
					</uni-list-item>
				</uni-list>
			</view>
		</uni-popup>
		
		<uni-popup ref="noticePopup" class="notice-content" background-color="#fff" type="center">
			<view class="notice-popup-content">
				
				<view style="align-items: center;display: flex;margin-bottom: 20rpx;">
					<uni-icons type="chat-filled" size="25"></uni-icons>
					<text style="font-size: 36rpx;font-weight: bolder;margin-left: 5rpx;">官方提醒：</text>
				</view>
				<swiper style="height: 250px;" class="swiper" circular :current="current" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
									:duration="duration">
					<swiper-item v-for="(item, index) in noticeList" :key="index">
						<scroll-view scroll-y style="height: 100%;">
							<view class="swiper-item rich-text" v-html="item.content" style="height: 100%;"></view>
						</scroll-view>
					</swiper-item>
				</swiper>
				<view class="ok-btn" @tap="noticeOK">我知道了</view>
			</view>
		</uni-popup>
		
		<view class="show-popup" v-if="isPay">
			<view class="popup-mask" @click="closePay"></view>
			<view class="popup-contents">
				<payment :info="info" @toCancel="closePay" @okPay="okPay" :payTypeId="payTypeId" :payOrderId="payOrderId" :payAmount="payAmount"></payment>
			</view>
		</view>
		
		<view class="xf-groups" @click="groupToggle" v-show="xfGroupsStatus">
			<view class="xf-group-item" v-for="(item, index) in groupsList" :key="index">
				<image :src="imagebaseurl + item.img" :style="index == 0 ? 'margin-left: 0rpx;' : 'margin-left: -10rpx;'"></image>
			</view>
		</view>
		
		<uni-popup ref="groupPopup" class="group-content" @change="groupPopupChange">
			<view class="group-content-item" v-for="(item, index) in groupsList" :key="index" v-show="item.remove == false">
				<image :src="imagebaseurl + item.img"></image>
				<text style="margin-left: 10rpx;margin-right: 10rpx;" @click="groupPay(item)">{{item.title}}</text>
				<uni-icons type="closeempty" size="16" @click="removeGroup(index,item)"></uni-icons>
			</view>
		</uni-popup>
	</view>
</template>
<script>
import { nextTick } from "vue";
import payment from '@/components/payment';
import { TUILogin } from '@tencentcloud/tui-core';
// #ifdef APP-PLUS || H5
import { TUIChatKit } from '@/TUIKit/index';
// 防御(20260904):TUIKit在app-plus环境init异常会中断页面模块加载→整页白屏卡死,失败仅告警不阻断;H5行为不变
try { TUIChatKit.init(); } catch (e) { console.warn('[TUIKit] init skipped:', e && e.message); }
// #endif
	export default {
		components: {
			payment
		},
		data() {
			return {
				inputVal:'',
				showLeft: false,
				imagebaseurl: this.ossUrl,
				projectList: [],
				page: 1,
				pageSize: 6,
				isLastPage: false,
				hotWords:[],
				imgFileUrl:'',
				imgFileNames: [],
				unReadCount:0,
				isLogin:false,
				imgs:[],
				userDetail:'',
				customerServiceImg:'',
				modelType:1,
				serveList:[],
				modelList:[],
				isPay:false,
				payOrderId:0,
				payAmount:0,
				noticeList:[],
				groupsList:[],
				xfGroupsStatus: true,
				removeCount: 0,
				payTypeId:1,
				info:'',
				nowGroupId:'',
				
				current:0,
				indicatorDots: true,
				autoplay: false,
				interval: 2000,
				duration: 500,
				
				isNotNetwork: false // 初始化网络状态
			}
		},
		mounted() {
			this.getNoticeList()
			this.$refs.noticePopup.open()
		  },
		onLoad:function(options) {
			if(options.token) {
			  uni.setStorageSync("wanju_token", options.token);
			}
			if (uni.getStorageSync('game_model_type')) {
				this.modelType = uni.getStorageSync('game_model_type')
			}
			this.getServeList()
			this.getModelList()
			this.getGroupList()
			
			if(this.isWeiXinLogin() && (!uni.getStorageSync('wanju_user_op') || uni.getStorageSync('wanju_user_op') == '0')) {
				this.getCode();
			}
		},
		
		onShow:function(){
			let that = this
			that.page = 1
			that.isLastPage = false
			
			that.loadHotWordList(that)
			if (uni.getStorageSync('wanju_token')) {
				that.isLogin = true;
				that.getUserDetail(that)
				that.loadMessageList(that)
				that.getUnReadCount(that)
				// that.initIM(that)
			}
			
		},
		onReachBottom:function() {
			
		},
		methods: {
			//判断是否微信登陆
			isWeiXinLogin() {
			    var ua = window.navigator.userAgent.toLowerCase();
			    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
			        return true; // 微信中打开
			    } else {
			        return false; // 普通浏览器中打开
			    }
			},
			getCode () {
				const code = this.getUrlParam('code');
				//截取路径中的code，如果没有就去微信授权，如果已经获取到了就直接传code给后台获取openId
				if (code == null || code === '') {
					const local = window.location.href;
					window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb4d3434afbdf00c2&redirect_uri=' + encodeURIComponent(local) + '&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect'
				} else {
					this.getOpenId(code) //把code传给后台获取用户信息
				}
			},
			getOpenId (code) { // 通过code获取 openId等用户信息
				this.ajax(this.url.getOpenId,"post",{code: code},function(res){
					uni.setStorageSync("game_ai_openid",res.msg);
				})
			},
			initIM(){
				let that = this
				that.ajax(that.url.initIM,"get",{groupId: that.nowGroupId},function(res){
				    TUILogin.login({
				      SDKAppID: res.data.appId,
				      userID: res.data.userId, 
				      userSig: res.data.userSig, 
				      useUploadPlugin: true, // If you need to send rich media messages, please set to true.
				      framework: `vue2` // framework used vue2 / vue3
				    }).catch(() => {});
					if (res.data.isValid) {
						setTimeout(() => {
							uni.navigateTo({ url: '/TUIKit/components/TUIChat/index?conversationID='+ res.data.toUserId });
						}, 1500);
					} else {
						uni.showToast({icon: 'none',title: res.data.validTime});
					}
				});
			},
			okPay: function() {
				this.isPay = false;
				this.$refs.groupPopup.close()
				uni.showLoading();
				this.initIM()
			},
			groupPay(model){
				let that = this
				// uni.navigateTo({ url: '/TUIKit/components/TUIConversation/index' });
				that.ajax(that.url.groupIsPay,"get",{groupId:model.id},function(res){
					that.nowGroupId = model.id
					if (res.data.result == 0) {
						that.$refs.groupPopup.close()
						that.initIM()
					} else if (res.data.result == 1) {
						that.ajax(that.url.orderCreate, "post", {goodsId: model.id, type: 3}, function(resp) {
							that.payOrderId = resp.data.payOrderId;
							that.payAmount = resp.data.payAmount;
							that.payTypeId = resp.data.payType
							that.info = resp.data.info
							that.isPay = true;
						});
					} else if (res.data.result == 2) {
						uni.showToast({icon: 'none',title: res.data.validTime});
					}
				})
			},
			// 解析URL 参数
			getUrlParam(name) {
				let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
				let r = window.location.search.substr(1).match(reg);
				if (r != null) {
					return unescape(r[2]);
				}
				return null;
			},
			removeGroup(i,item){
				this.$set(item, 'remove', true);
				this.removeCount++
				if (this.removeCount == this.groupsList.length){
					this.$refs.groupPopup.close()
				}
			},
			groupPopupChange(e) {
				if (e.show == false) {
					this.xfGroupsStatus = true
				}
			},
			groupToggle(){
				this.groupsList.forEach(item => {
				   this.$set(item, 'remove', false);
				 });
				this.$refs.groupPopup.open()
				this.xfGroupsStatus = false
				this.removeCount = 0
			},
			noticeOK(){
				// uni.setStorageSync("game_notice1_ok",1)
				this.$refs.noticePopup.close()
			},
			getNoticeList(){
				let that = this
				that.ajax(that.url.noticeList, "GET", {type: 1}, function(resp) {
					 that.noticeList = resp.data;
				})
			},
			getGroupList(){
				let that = this
				that.ajax(that.url.groups, "GET", null, function(resp) {
					 that.groupsList = resp.data;
				})
			},
			getServeList(){
				let that = this
				that.ajax(that.url.menuList, "GET", {type: 3}, function(resp) {
					 that.serveList = resp.data;
				})
			},
			getModelList(){
				let that = this
				that.ajax(that.url.models, "GET", null, function(resp) {
					 that.modelList = resp.data;
				})
			},
			serveToggle(){
				this.$refs.servePopup.open()
			},
			loadMore() {
			  let that = this
			  if (that.isLastPage) return
			  that.page = that.page + 1
			  that.loadMessageList(that)
			},
			changeModelType(item) {
				if (item.payWay == 2) {
					this.pay(item)
					// this.payAmount = item.price;
					// this.payOrderId = item.id;
					// this.isPay = true;
				} else {
					this.modelType = item.id;
					uni.setStorageSync("game_model_type",item.id)
				}
				this.$refs.modelPopup.close()
			},
			pay(model) {
				if (model.price > 0) {
					let that = this
					that.ajax(that.url.orderCreate, "post", {goodsId: model.id, type: 1}, function(resp) {
						that.payOrderId = resp.data.payOrderId;
						that.payAmount = resp.data.payAmount;
						that.payTypeId = resp.data.payType
						that.isPay = true;
					});
				}
			},
			menuToggle(type) {
				this.$refs.modelPopup.open(type)
				
			},
			logout(){
				uni.removeStorageSync('wanju_token');
				uni.removeStorageSync('wanju_nickName');
				uni.removeStorageSync('wanju_avatarUrl');
				uni.removeStorageSync('wanju_user_op');
				uni.removeStorageSync('game_notice1_ok');
				uni.removeStorageSync('game_ai_openid');
				uni.showToast({
				    title: '退出成功'
				});
				setTimeout(function () {
					 window.location.href = "/#/pages/chat/index";
				}, 1500);
			},
			postChat: function() {
				if (!this.isLogin) {
					uni.showToast({icon: 'none',title: '请登录后再操作'});
					this.$refs['showLeft'].open()
					return;
				}
				// if (this.userDetail != '' && this.userDetail.vipType == 0) {
				// 	// uni.showToast({icon: 'none',title: '未成为会员无权限解析，请联系人工办理会员！'});
				// 	uni.showModal({
				// 		title: '官方提醒',
				// 		content: "尚未成为会员，暂无权限解析。请联系人工办理会员！",
				// 		showCancel: false,
				// 		confirmText: '我已知晓',
				// 		success: function (res) {
				// 			if (res.confirm) {
				// 				console.log('用户点击确定');
				// 			}
				// 		}
				// 	});
				// 	return;
				// }
				var that = this;
				if (that.inputVal == "" ||  that.inputVal.length == 0) {
					return;
				}
				var formData = {
					title: that.inputVal,
					img: that.imgs,
					modelType: that.modelType
				};
				uni.showLoading({
					title: '球域Ai正在解析，请稍等',
					mask: true
				});
				that.ajax(that.url.demandSave, "post", formData, function(resp) {
					uni.showToast({
						icon: "none",
						title: "发布成功，Ai解析中..."
					});
					that.imgFileNames = [];
					that.imgs = [];
					that.inputVal = "";
					
					if (resp.data.status == 1) {
						uni.showModal({
							title: '解析完成',
							content: "您的提问已解析完成，请及时查看！",
							showCancel: false,
							confirmText: '立即查看',
							success: function (res) {
								if (res.confirm) {
									uni.navigateTo({
										url:'/pages/chat/detail?id='+resp.data.id
									})
								}
							}
						});
					} else {
						setTimeout(function () {
							 that.loadMessageList(that)
						}, 1500);
					}
					
				})
			},
			removeImgFile(i) {
				this.imgFileNames.splice(i, 1);
				this.imgs.splice(i, 1);
			},
			loadHotWordList:function(ref){
				ref.ajax(ref.url.hotWord,"get",{},function(resp){
					ref.hotWords = resp.data.hotWord
					ref.customerServiceImg = resp.data.customerService
				})
			},
			loadMessageList:function(ref){
				let data = {
					page:ref.page,
					pageSize:ref.pageSize,
					status:1,
				}
				ref.ajax(ref.url.demandList,"get",data,function(resp){
					let result = resp.data.content
					if (result == null || result.length == 0){
						ref.isLastPage = true
						ref.page = ref.page - 1
					}else{
						if (ref.page == 1) ref.projectList = []
						ref.projectList = ref.projectList.concat(result)
						if (ref.page > 1){
							// uni.showToast({
							// 	icon:'none',
							// 	title:"又加载了" + result.length + "个项目"
							// })
						}
					}
				})
			},
			serveChange(url) {
				this.$refs.servePopup.close()
				if (url) {
					if (url.includes('http')) {
						  window.location.href = url.replace(/&amp;/g, '&');
					} else {
						
						this.$refs.popup.open()
					}
				} 
			},
			closePay: function() {
				this.isPay = false;
			},
			tagVal(val){
				this.inputVal = val;
			},
			toggle(type) {
				this.type = type
				// open 方法传入参数 等同在 uni-popup 组件上绑定 type属性
				this.$refs.popup.open(type)
			},
			// 打开窗口
			showDrawer() {
				this.$refs['showLeft'].open()
			},
			// 关闭窗口
			closeDrawer(e) {
				this.$refs[e].close()
			},
			
			toDetail:function(id, status){
				if (status == 1) {
					uni.navigateTo({
						url:'/pages/chat/detail?id='+id
					})
				}
			},
			toLogin:function(){
				this.isWeiXinLogin() ? window.location.href = "/#/pages/login/index" : uni.navigateTo({url: "/pages/login/login"})
			},
			getUnReadCount:function(ref){
				ref.ajax(ref.url.unReadCount,"get",null,function(resp){
					ref.unReadCount = resp.data
				})
			},
			toPage:function(name,url){
				uni.navigateTo({
					url:url
				})
			},
			getUserDetail(that){
				that.ajax(that.url.userDetail, "GET", null, function(resp) {
					that.userDetail = resp.data;
				})
			},
			upLoadPhoto(){
				if (!this.isLogin) {
					uni.showToast({icon: 'none',title: '请登录后再操作'});
					return;
				}
				if (this.userDetail != '' && this.userDetail.vipType == 0) {
					// uni.showToast({icon: 'none',title: '未成为会员无权限解析，请联系人工办理会员！'});
					uni.showModal({
						title: '官方提醒',
						content: "尚未成为会员，暂无权限解析。请联系人工办理会员！",
						showCancel: false,
						confirmText: '我已知晓',
						success: function (res) {
							if (res.confirm) {
								console.log('用户点击确定');
							}
						}
					});
					return;
				}
				if(this.imgs.length >= 9){
					uni.showToast({
						title:'图片最多上传9张',
						icon:'none'
					})
					return;
				}
				let _this = this;
				uni.chooseImage({
				    count: 4,
				    sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
				    sourceType: ['album','camera'], //从相册选择
				    success: function(res) {
						
						if(_this.imgs.length + res.tempFilePaths.length > 9){
							uni.showToast({
								title:'图片数量不能大于9张',
								icon:'none'
							})
							return;
						}
					
						var item = res.tempFiles.find(item=>{
							return item.size > 10*1024*1024
						})
						if(item){
							uni.showToast({
								title:'单张图片大小不得高于10M',
								icon:"none"
							})
							return;
						}
						
						const tempFilePaths = res.tempFilePaths;
						const tempFiles = res.tempFiles;
						console.info(res)
						uni.showLoading({
							title: "上传中"
						});
						
						 for (let i = 0; i < tempFilePaths.length; i++) {
							 
							uni.uploadFile({
								url: _this.uploadUrl + '/upload', //接口地址
								filePath: tempFilePaths[i],
								name: 'file',
								formData:{  //后台所需除图片外的参数可以写在这里面 ，单张多张都可
								    //"token": uni.getStorageSync('token'), 
								},
								success: (res) => {
									
									_this.imgFileNames.push(tempFiles[i].name)
									
									let data = JSON.parse(res.data);
									uni.hideLoading();
									if(data.code == 200){
										if (_this.imgs == '') {
											_this.imgs = [];
										}
										_this.imgs.push(data.msg);
										
										// uni.showToast({
										// 	 icon: 'none',
										// 	 title: data.msg
										// }); 
										
									}else {
										_this.value.pop();
										uni.showToast({
											 icon: 'none',
											 title: data.msg
										}); 
									}
								}
							});
						 }
					}
				})
			},
		}
	}
</script>

<style lang="less">
	@import url("index.less");
	
	::v-deep .serve-content .uni-list-item__container {
		padding: 15px 0px 15px 0px;
	}
	::v-deep .model-content .uni-list-item__container {
		padding: 15px 0px 15px 0px;
	}
	// ::v-deep .serve-content .uni-list-item__content-title{
	// 	font-size: 16px;
	// }
	::v-deep .group-content .uni-popup__wrapper-box{
		position: fixed;
		right: 0;
		top: 20%;
	}
</style>
