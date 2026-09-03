<template>
    <view class="page">
		
		<view class="expert-stat">
			<view class="expert-stat-item">
				<text>{{ predictNum}}</text>
				<view>预测场次</view>
			</view>
			<view class="expert-stat-item">
				<text>{{ hitRate }}%</text>
				<view>命中率</view>
			</view>
			<view class="expert-stat-item">
				<text>{{ redNum }}</text>
				<view>连红</view>
			</view>
		</view>
        <view style="font-weight: bolder;">近期推荐赛事</view>
		<view class="match-list" v-if="!getSuccess" style="height: 800rpx;background-color: #fafafa;"></view>
		<view class="match-list" v-if="getSuccess && orderList.length == 0" style="height: 800rpx;background-color: #fafafa;text-align: center;line-height: 800rpx;color: #989ea5;">无推荐赛事</view>
		<view class="game-content">
			<view class="game-item" v-for="(item, index) in orderList" :key="index">
				<view class="game-item-title">
					<text class="game-league">{{item.leagueAbbName}}</text>
					<text class="game-item-title-right">
						<text class="game-info" v-if="!item.result">AI解析</text>
						<text class="game-cjhx-tag" v-if="item.remark"><uni-icons type="star-filled" size="13" color="#fff"></uni-icons>{{item.remark}}</text>
						<text class="game-result-tag game-result-success" v-if="item.result == '1'"><uni-icons type="checkmarkempty" size="13" color="#fff"></uni-icons>正确</text>
						<text class="game-result-tag game-result-error" v-if="item.result == '0'"><uni-icons type="closeempty" size="13" color="#fff"></uni-icons>错误</text>
						<text class="game-result-tag game-result-he" v-if="item.result == '2'"><uni-icons type="tune" size="13" color="#fff"></uni-icons>和</text>
					</text>
				</view>
				<view class="game-item-content">
					<view class="game-team">{{item.homeTeamAllName}}</view>
					<view class="game-vs"><text class="game-item-vs">VS</text></view>
					<view class="game-team">{{item.awayTeamAllName}}</view>
				</view>
				<view class="game-item-bottom">
					<view class="game-date"><image src="/static/icon/time.png"></image>{{ item.matchDate.substring(5) }} {{item.matchTime}} {{ item.weekday }}</view>
					<view class="game-option" @tap="toLock(item)">
						<view class="game-btn mount-family" v-if="item.price > 0" style="background-color: #e85099;">
							<text v-if="item.isUnlock">查看<uni-icons type="forward" size="18" color="#fff" style="margin-left: 2px;"></uni-icons></text>
							<text v-else><uni-icons type="locked-filled" size="18" color="#fff" style="margin-right: 2px;"></uni-icons>解锁</text>
						</view>
						<view class="game-btn mount-family" style="background-color: #0b9bde;" v-else>查看<uni-icons type="forward" size="18" color="#fff" style="margin-left: 2px;"></uni-icons></view>
					</view>
				</view>
			</view>
			
		</view>
		
		<uni-popup ref="noticePopup" class="notice-content" background-color="#fff" type="center" v-if="payGameItem">
			<view class="notice-popup-content">
				<view style="text-align: center;">
					<text style="font-size: 36rpx;font-weight: bolder;">友情提醒</text>
				</view>
				<view class="pay-notice-content">
					<text>您将花费</text>
					<text class="mount-family" :style="payGameItem.price != payGameItem.discountPrice ? 'text-decoration: line-through;color: #a49f9f' : ''">{{payGameItem.price || 0}}</text>
					<text class="mount-family" v-if="payGameItem.price != payGameItem.discountPrice">{{payGameItem.discountPrice || 0}}</text>
					<view>解锁本场比赛分析!</view>
				</view>
				<view class="notice-option">
					<view class="notice-option-item" @tap="cancelNotice" style="background-color: #f4f4f4;color: #000;">取消</view>
					<view class="notice-option-item" @tap="payNotice" style="background-color: #2864f8;">支付</view>
				</view>
			</view>
		</uni-popup>
		<view class="show-popup" v-if="isPay">
			<view class="popup-mask" @click="closePay"></view>
			<view class="popup-contents">
				<payment @toCancel="closePay" @okPay="okPay" :markIndex="markIndex" :payTypeId="6" :payOrderId="payOrderId" :payAmount="payAmount"></payment>
			</view>
		</view>
    </view>
</template>

<script>
import payment from '@/components/payment';
export default {
	components: {
		payment
	},
    data() {
        return {
           page: 1,
           pageSize: 10,
           totalPages:0,
		   getSuccess:false,
		   orderList:[],
		   expertDataId:null,
		   isPay:false,
		   payOrderId:0,
		   payAmount:0,
		   isLogin:false,
		   payGameItem:null,
		   predictNum:'--',
		   redNum:'--',
		   hitRate:'--',
		   imagebaseurl: this.ossUrl,
        };
    },
    onLoad: function (options) {
		if(options.expertId) {
		  this.expertDataId = options.expertId;
		}
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {},
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
		if (uni.getStorageSync('wanju_token')) {
			this.isLogin = true;
		}
		this.detailData(this.expertDataId);
		this.getList();
	},
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {},
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {},
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {},
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
		let that = this
		if (that.isLastPage) return
		that.page = that.page + 1
		that.getList();
	},
    methods: {
		closePay: function() {
			this.isPay = false;
		},
		okPay: function() {
			this.isPay = false;
			uni.navigateTo({
				url: '/pages/ai_expert/matchDetail?id=' + this.markIndex
			})
		},
		payNotice(){
			let that = this
			that.ajax(that.url.orderCreate, "post", {goodsId: that.payGameItem.id, type: 6}, function(resp) {
				that.payOrderId = resp.data.payOrderId;
				that.payAmount = resp.data.payAmount;
				that.$refs.noticePopup.close()
				that.isPay = true;
			});
		},
		cancelNotice(){
			this.$refs.noticePopup.close()
		},
		toLock:function(item){
			if (!this.isLogin) {
				uni.showToast({icon: 'none',title: '请登录后再操作'});
				return;
			}
			if (item.price > 0) {
				if (item.isUnlock == false) {
					this.payGameItem = item
					this.markIndex = item.id
					this.$nextTick(() => {
					  this.$refs.noticePopup.open()
					});
					return
				}
			}
			uni.navigateTo({
				url:'/pages/ai_expert/matchDetail?id='+item.id
			})
		},
		detailData(expertId) {
			let ref = this
			ref.ajax(ref.url.expertDetail+'/' + expertId, "GET", null, function(resp) {
				ref.expertData = resp.data
				if(resp.data) {
					ref.redNum = resp.data.redNum;
					ref.hitRate = resp.data.hitRate;
					ref.predictNum = resp.data.predictNum;
				}
			})
		},
		getList() {
			let ref = this
			let data = {
				page:ref.page,
				pageSize:ref.pageSize,
				expertId: ref.expertDataId
			}
			ref.ajax(ref.url.expertMatchsList, "GET", data, function(resp) {
				let result = resp.data.content
				ref.total = resp.data.totalElements;
				ref.getSuccess = true;
				if (result == null || result.length == 0){
					ref.isLastPage = true
					ref.page = ref.page - 1
				}else{
					if (ref.page == 1) ref.orderList = []
					ref.orderList = ref.orderList.concat(result)
					if (ref.page > 1){
						// uni.showToast({
						// 	icon:'none',
						// 	title:"又加载了" + result.length + "个项目"
						// })
					}
				}
			})
		},
    }
};
</script>
<style>
@import './detail.css';
</style>