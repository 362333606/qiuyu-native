# 球域AI iOS 离线打包壳

组装流程（CI，等iOS SDK到手后激活）：
1. www资源 = app仓库 build-app-bundle.yml 的产物（dist/build/app-plus）
2. 放入 SDK/Resources/apps/__UNI__01C0A7B/www
3. dcloud_control.xml 填 appid=__UNI__01C0A7B + iOS AppKey(secrets.DCLOUD_IOS_APPKEY)
4. Xcode工程基于 SDK 内 HBuilder-Hello 样例改造，bundle id=cn.qyai001.qiuyu
5. 签名复用苹果证书(Apple Distribution, 密码Qyai2026app) + AdHoc profile "QiuYu AdHoc 20260903"
6. xcodebuild archive → export ipa → 直装119 + altool传TestFlight

SDK获取：dev.dcloud.net.cn 登录后各平台SDK下载（服务器IP风控，2026-09-04 02:55解锁后自动下载）
