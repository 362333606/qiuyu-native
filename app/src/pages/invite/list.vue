<template>
    <view class="partner-container">
		<view class="invite-content">
			<view class="invite-item" v-for="(item,index) in userList">
				<view class="user-logo">
					<image :src="item.pic" v-if="item.pic.includes('http')" />
					<image :src="imagebaseurl + item.pic" v-if="!item.pic.includes('http')" />
				</view>
				<view class="user-info">
					<view>{{item.phone}}</view>
				</view>
				<view class="user-price">{{item.time}}</view>
			</view>
		</view>
		<view v-if="userList.length == 0" class="no-more-goods">
		    <image src="/static/empty_record.png" class="empty-record"></image>
		    <view class="text">还没有任何记录呢</view>
		</view>
    </view>
</template>

<script>
//index.js
//获取应用实例
export default {
    data() {
        return {
			type:0,
			curPage: 1,
			pageSize: 5,
			totalPages: 0,
			userList:[],
			loadingMoreHidden:false,
			imagebaseurl: this.ossUrl,
        };
    },
    onShow: function () {
		this.getList();
    },
	onReachBottom: function () {
		// 滚动刷新
		if (this.curPage == this.totalPages) {
			return;
		}
	    this.setData({
	        curPage: this.curPage + 1
	    });
	    this.getList();
	},
    methods: {
		getList() {
			let ref = this
			uni.showLoading({
			    title: '加载中'
			});
			let data = {
				page: ref.page,
				pageSize: ref.pageSize,
			}
		   ref.ajax(ref.url.userInviteList, "GET", data, function(resp) {
			   let newArray = resp.data;
			   ref.userList = [...ref.userList,...newArray];
			   uni.hideLoading();
		   })
		}
    }
};
</script>
<style>
@import './list.css';
</style>
