<script>
	// 2026-09-06 v2.1.13: uniPush2.0客户端——cid上报(qyai-feed) + 通知点击跳转
	// 离线打包iOS: Push模块由CI加Push Notifications/Background Modes capability
	var PUSH_BIND_URL = 'https://qyai001.cn/data/api/qyai-feed/push/bind';
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// #ifdef APP-PLUS
			this.initPush()
			// #endif
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		// #ifdef APP-PLUS
		methods: {
			initPush: function() {
				// 1) 统一监听:前台收到(res.type=receive)不弹本地(服务端已走APNs弹)——只处理点击
				try {
					uni.onPushMessage(function(res) {
						if (!res || res.type !== 'click') return
						var d = res.data || {}
						var p = (typeof d.payload === 'string') ? JSON.parse(d.payload) : (d.payload || d)
						goPushPage(p)
					})
				} catch (e) {
					console.log('[push] onPushMessage err', e)
				}
				// 2) 杀进程状态点通知栏拉起:launcher=push,arguments=payload
				try {
					if (plus.runtime.launcher === 'push' && plus.runtime.arguments) {
						var raw = plus.runtime.arguments
						var p2 = null
						try { p2 = JSON.parse(raw) } catch (e) { p2 = null }
						goPushPage(p2 && (p2.payload || p2))
					}
				} catch (e) {}
				// 3) cid上报(iOS冷启动cid可能要几秒才生成,重试兜底)
				this.reportCid(0)
			},
			reportCid: function(n) {
				var self = this
				uni.getPushClientId({
					success: function(res) {
						var cid = res && res.cid
						if (!cid) {
							if (n < 6) setTimeout(function() { self.reportCid(n + 1) }, 10000)
							return
						}
						uni.setStorageSync('push_cid', cid)
						uni.request({
							url: PUSH_BIND_URL,
							method: 'POST',
							header: {
								'Content-Type': 'application/x-www-form-urlencoded',
								'X-wanju-Token': uni.getStorageSync('wanju_token') || ''
							},
							data: {
								cid: cid,
								platform: plus.os.name,
								app_version: plus.runtime.version,
								appid: plus.runtime.appid
							},
							success: function(r) {
								console.log('[push] cid绑定', r.statusCode, r.data && r.data.msg)
							},
							fail: function() {
								if (n < 3) setTimeout(function() { self.reportCid(n + 1) }, 30000)
							}
						})
					},
					fail: function(e) {
						if (n < 6) setTimeout(function() { self.reportCid(n + 1) }, 10000)
					}
				})
			}
		}
		// #endif
	}
	// #ifdef APP-PLUS
	function goPushPage(p) {
		if (!p) return
		var page = p.page
		if (!page) return
		if (page.indexOf('/') !== 0) page = '/' + page
		uni.switchTab({
			url: page,
			fail: function() {
				uni.navigateTo({ url: page, fail: function() {} })
			}
		})
	}
	// #endif
</script>

<style>
@import './app.css';
</style>
