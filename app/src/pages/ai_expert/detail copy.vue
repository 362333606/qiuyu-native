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
		<view class="match-list">
			<view class="match-item" v-for="(item, index) in orderList" :key="index">
				<view class="match-title">
					<view>
						<text class="match-tag">{{ item.leagueAbbName }}</text>
						<text style="font-size: 28rpx;">{{ item.weekday }}</text>
					</view>
					<view v-if="item.result == '1'" style="color: #ff5722;text-align: center;">正确</view>
					<view v-if="item.result == '0'" style="color: #c2c2c2;text-align: center;">错误</view>
					<view v-if="item.result == '2'" style="color: #ffb800;text-align: center;">和</view>
					<view style="text-align: right;">
						<uni-icons v-if="!item.isUnlock" type="locked-filled" size="14" color="#989ea5"></uni-icons>
						<text style="margin-left: 2rpx;font-size: 28rpx;">{{ item.matchDate.split('-').slice(1).join('-') }} {{ item.matchTime }}</text>
					</view>
				</view>
				<view class="match-info">
					<view>
						<image src="/static/zhudui.png"></image>
						<view class="match-name" style="color: #4955a0;">{{ item.homeTeamAllName }}</view>
					</view>
					<view>
						<view style="font-weight: bolder;font-size: 40rpx;color: #ee443b;">VS</view>
						<view style="font-weight: bolder;color: #989ea5;">{{ item.matchDate.split('-').slice(1).join('-') }} {{ item.matchTime }}</view>
						<view style="color: #989ea5;">{{ item.weekday }} {{ item.remark }}</view>
					</view>
					<view>
						<image src="/static/kedui.png"></image>
						<view class="match-name" style="color: #ba744d;">{{ item.awayTeamAllName }}</view>
					</view>
				</view>
				<!-- <view class="match-reason">
					<view style="margin-bottom: 10rpx;">
						<uni-icons type="info" size="28" color="#de8d4e" style="vertical-align: sub;"></uni-icons>
						<text style="margin-left: 10rpx;color: #55585b;">推荐理由</text>
					</view>
					<view>马竞作为西甲的传统强队，其整体实力和防守稳固性在联赛中处于领先地位。客场面对贝蒂斯，独赢赔率1.97，</view>
				</view> -->
				<view class="match-btn">
					
					<text v-if="item.price > 0">
						<text class="match-lock-btn" @click="toLock(item)" v-if="item.isUnlock">
							<uni-icons type="eye" size="20" color="#4792dc" style="vertical-align: bottom;"></uni-icons>
							<text>查看详情</text>
						</text>
						<text class="match-lock-btn" @click="toLock(item)" v-if="!item.isUnlock" style="background-color: red;color: white;">
							<uni-icons type="locked" size="20" color="#fff" style="vertical-align: bottom;"></uni-icons>
							<text>解锁查看</text>
						</text>
					</text>
					<text class="match-lock-btn" @click="toLock(item)" v-else>
						<text>
							<uni-icons type="eye" size="20" color="#4792dc" style="vertical-align: bottom;"></uni-icons>
							<text>免费查看</text>
						</text>
					</text>
					
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
					<view class="notice-option-item" @tap="payNotice" style="background-color: #44c9e8;">支付</view>
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