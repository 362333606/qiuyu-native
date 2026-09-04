import Vue from 'vue'
import App from './App'
Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
// #ifndef VUE3
import VueCompositionAPI from '@vue/composition-api';
Vue.use(VueCompositionAPI);
// #endif
Vue.prototype.ossUrl = "https://oss.bestpw.cn/"
Vue.prototype.uploadUrl = "https://qyai001.cn/api"
var API_BASE_URL = 'https://qyai001.cn/api';
let baseUrl = "https://qyai001.cn/api"
// let baseUrl = "http://localhost:8091/api"
Vue.prototype.url={
	login: "/login",
	wxLogin: "/wxuser/login",
	register: "/register",
	getData: "/data",
	newsDetail: "/news/detail",
	menuList: "/menu/list",
	demandSave: "/demand/save",
	demandList: "/demand/list",
	demandDetail: "/demand/detail",
	hotWord: "/hotWord",
	unReadCount: "/demand/unReadCount",
	sendCode: "/sendCode",
	vipCard: "/balance/vipCard",
	rechargePackage: "/balance/recharge_Package",
	balanceDeposit: "/balance/deposit",
	payOrder: "/pay/order",
	balance: "/balance",
	models: "/models",
	orderCreate: "/order/create",
	payContent: "/demand/payContent",
	orderList: "/order",
	noticeList: "/notice",
	groups: "/chat/groups",
	groupIsPay: "/chat/groupIsPay",
	initIM: "/chat/init",
	getOpenId: "/wxuser/openid",
	
	matchsList: "/matchs/list",
	matchsDetail: "/matchs/detail",
	matchsVerifyUnlock: "/matchs/verifyUnlock",
	matchsIsPay: "/matchs/isTodayPay",
	
	goalMatchsList: "/goalMatchs/list",
	goalMatchsDetail: "/goalMatchs/detail",
	goalMatchsIsPay: "/goalMatchs/isTodayPay",
	
	expertList: "/expert/list",
	expertDetail: "/expert/detail",
	expertMatchsList: "/expertMatchs/list",
	expertMatchsDetail: "/expertMatchs/detail",
	expertMatchsIsPay: "/expertMatchs/isTodayPay",
	
	
	
	//我的
	userDetail: "/user/detail",
	updatePassword: "/user/updatePwd",
	userPayment: "/user/payment",
	updatePayment: "/user/updatePayment",
	bindPhone: "/user/bindphone",
	userInviteList: "/user/inviteList"
	

}

Vue.prototype.checkPermission = function(perms){
	let permission = uni.getStorageSync("permission")
	let result = false
	for(let one of perms){
		if(permission.indexOf(one) != -1){
			result = true
			break
		}
	}
	return result;
}

Vue.prototype.ajax = function(url, method, data, fun) {
	if (url != '/demand/save') {
		uni.showLoading();
	}
	uni.request({
		url: baseUrl + url,
		method: method,
		header: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'X-wanju-Token': uni.getStorageSync('wanju_token')
		},
		data: data,
		success: function(resp) {
			uni.hideLoading();
			if (resp.statusCode == 401) {
				uni.redirectTo({
					url: "/pages/login/login"
				})
			} else if (resp.statusCode == 200 && resp.data.code == 200) {
				let data = resp.data
				if (data.hasOwnProperty("wanju_token")) {
					let token = data.token
					console.log(token)
					uni.setStorageSync("wanju_token", token)
				}
				fun(data)
			} else {
				uni.showToast({
					icon: "none",
					title: resp.data.msg
				})
			}
		},
		fail: function(err) {
			// 2026-09-05补: 网络层失败时关掉loading,否则转圈永不消失=观感"锁死"
			uni.hideLoading();
			uni.showToast({
				icon: "none",
				title: "网络异常,请重试"
			});
		}
	})
}
Date.prototype.format = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份 
		"d+": this.getDate(), //日 
		"h+": this.getHours(), //小时 
		"m+": this.getMinutes(), //分 
		"s+": this.getSeconds(), //秒 
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		"S": this.getMilliseconds() //毫秒 
	};
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
}

Vue.prototype.checkNull = function(data, name) {
	if (data == null) {
		uni.showToast({
			icon: "none",
			title: name + "不能为空"
		})
		return true
	}
	return false
}

Vue.prototype.checkBlank = function(data, name) {
	if (data == null || data == "") {
		uni.showToast({
			icon: "none",
			title: name + "不能为空"
		})
		return true
	}
	return false
}
Vue.prototype.checkValidName = function(data, name) {
	if (data == null || data == "") {
		uni.showToast({
			icon: "none",
			title: name + "不能为空"
		})
		return true
	} else if (!/^[\u4e00-\u9fa5]{2,15}$/.test(data)) {
		uni.showToast({
			icon: "none",
			title: name + "内容不正确"
		})
		return true
	}
	return false
}
Vue.prototype.checkValidTel = function(data, name) {
	if (data == null || data == "") {
		uni.showToast({
			icon: "none",
			title: name + "不能为空"
		})
		return true
	} else if (!/^1[0-9]{10}$/.test(data)) {
		uni.showToast({
			icon: "none",
			title: name + "内容不正确"
		})
		return true
	}
	return false
}
Vue.prototype.checkValidEmail = function(data, name) {
	if (data == null || data == "") {
		uni.showToast({
			icon: "none",
			title: name + "不能为空"
		})
		return true
	} else if (!/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(data)) {
		uni.showToast({
			icon: "none",
			title: name + "内容不正确"
		})
		return true
	}
	return false
}
Vue.prototype.checkValidStartAndEnd = function(start, end) {
	let d1 = new Date("2000/01/01 " + start + ":00");
	let d2 = new Date("2000/01/01 " + end + ":00");
	if (d2.getTime() <= d1.getTime()) {
		uni.showToast({
			icon: "none",
			title: "结束时间必须大于开始时间"
		})
		return true
	}
	return false
}