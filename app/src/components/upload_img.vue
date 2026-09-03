<template>
	<view class="upload-content">
		<view class="upload-item1" v-for="(item, i) in imgs" :key="i" v-if="imgs.length > 0">
			<text v-if="item && item.includes('pdf')" @click="openPdf(item)">查看pdf合同</text>
			<image class="uploadImage" :src="imagebaseurl+item" style="width: 30px;height: 45px;" @click="preview(imagebaseurl+item)" v-if="item && !item.includes('pdf')"></image>
			<uni-icons type="close" size="22" color="#red" class="clearDiv" @click="delimg(i)" v-if="item"></uni-icons>
		</view>
		<view class="upload-item" @click="upLoadPhoto()" v-if="upload && imgs.length < 9">
			<text class="upload-text">请选择</text>
			<image src="/static/icon/down.png" class="input-down-icon"></image>
		</view>
		<q-previewImage :urls="imgs" ref="previewImage" v-if="imgs"></q-previewImage>
	</view>
	
</template>

<script>
	const app = getApp();
	export default {
		props: ['imgsUrl'],
	    data() {
	        return {
				upload:true,
				imagebaseurl: this.ossUrl,
				imgs: this.imgsUrl,
				// previewImgs:[]
				}
			},
			mounted: function () {
				console.info(this.imgs)
			},
			watch: {
				imgs(newValue, oldValue) {
					console.log('值发生了变化:', newValue);

					this.$emit('update:imgsUrl', newValue)
					if(newValue.length == 9) {
						this.upload = false;
					} else {
						this.upload = true;
					}
				}
			},
			methods: {
				openPdf(url){
					
				uni.downloadFile({
					url: this.imagebaseurl + url,
					success: function(res) {
						uni.showLoading("加载中...")
						if (res.statusCode === 200) {
							uni.hideLoading();
							var filePath = res.tempFilePath; // 获取到本地临时路径
							// 调用wx.openDocument打开文件
							uni.openDocument({
							   filePath: filePath,
							   success: function(res) {
									console.log('打开文档成功')
								},
								fail: function(err) {
									console.log('打开文档失败', err)
								}
								})
							}
						},
						fail: function(err) {
							uni.hideLoading();
							console.log('下载文件失败', err)
						}
					})
				},
				preview(url) {
					// this.image_list.push(imgs);
					this.$refs.previewImage.open(url);
				},
				delimg(i){
					this.imgs.splice(i, 1);
				},
				upLoadPhoto(){
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
		};
</script>

<style>
	.upload-content{
		display: inline-block;
		width: 100%;
		text-align: right;
	}
	.upload-item{
		color: #808080;
		display: inline-block;
		line-height: 100rpx;
	}
	.upload-item1{
		position: relative;
		display: inline-block;
		margin-right: 20rpx;
		border: 1px solid #808080;
	}
	.clearDiv{
		position: absolute;
		top: -5px;
		right: -5px;
		text-align: center;
		margin: 0 auto;
		line-height: 20px;
	}
	
</style>