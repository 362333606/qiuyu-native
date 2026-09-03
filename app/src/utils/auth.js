// const WXAPI = require('@/miniprogram_npm/apifm-wxapi');
async function checkSession() {
    return new Promise((resolve, reject) => {
        uni.checkSession({
            success() {
                return resolve(true);
            },
            fail() {
                return resolve(false);
            }
        });
    });
}
async function bindSeller() {
    const token = uni.getStorageSync('bestpw-Token');
    const referrer = uni.getStorageSync('referrer');
    if (!token) {
        return;
    }
    if (!referrer) {
        return;
    }
    const res = await WXAPI.bindSeller({
        token,
        uid: referrer
    });
}

// 检测登录状态，返回 true / false
async function checkHasLogined() {
    const token = uni.getStorageSync('bestpw-Token');
    if (!token) {
        return false;
    }
    const loggined = await checkSession();
    if (!loggined) {
        uni.removeStorageSync('bestpw-Token');
        return false;
    }
    const checkTokenRes = await WXAPI.checkToken(token);
    if (checkTokenRes.code != 200) {
        uni.removeStorageSync('bestpw-Token');
        return false;
    }
    return true;
}
async function wxaCode() {
    return new Promise((resolve, reject) => {
        uni.login({
            success(res) {
                return resolve(res.code);
            },
            fail() {
                uni.showToast({
                    title: '获取code失败',
                    icon: 'none'
                });
                return resolve('获取code失败');
            }
        });
    });
}
async function login(page) {
    const _this = this;
    uni.login({
        success: function (res) {
            const componentAppid = uni.getStorageSync('componentAppid');
            if (componentAppid) {
                WXAPI.wxappServiceLogin({
                    componentAppid,
                    appid: uni.getStorageSync('appid'),
                    code: res.code
                }).then(function (res) {
                    if (res.code == 10000) {
                        // 去注册
                        return;
                    }
                    if (res.code != 0) {
                        // 登录错误
                        uni.showModal({
                            title: '无法登录',
                            content: res.msg,
                            showCancel: false
                        });
                        return;
                    }
                    uni.setStorageSync('bestpw-Token', res.data.token);
                    uni.setStorageSync('uid', res.data.uid);
                    _this.bindSeller();
                    if (page) {
                        page.onShow();
                    }
                });
            } else {
                WXAPI.login_wx(res.code).then(function (res) {
                    console.log('-------------wx Login---------------------' + res.code);
                    if (res.code == 10000) {
                        // 去注册
                        return;
                    }
                    if (res.code != 0) {
                        // 登录错误
                        uni.showModal({
                            title: '无法登录',
                            content: res.msg,
                            showCancel: false
                        });
                        return;
                    }
                    uni.setStorageSync('bestpw-Token', res.data.token);
                    uni.setStorageSync('uid', res.data.uid);
                    _this.bindSeller();
                    if (page) {
                        page.onShow();
                    }
                });
            }
        }
    });
}
async function authorize() {
    console.log('------------util auth  authorize  --------------------------');
    return new Promise((resolve, reject) => {
        uni.login({
            success: function (res) {
                const code = res.code;
                let referrer = ''; // 推荐人
                let referrer_storge = uni.getStorageSync('referrer');
                if (referrer_storge) {
                    referrer = referrer_storge;
                }
                // 下面开始调用注册接口
                const componentAppid = uni.getStorageSync('componentAppid');
                if (componentAppid) {
                    WXAPI.wxappServiceAuthorize({
                        code: code,
                        referrer: referrer
                    }).then(function (res) {
                        if (res.code == 0) {
                            uni.setStorageSync('bestpw-Token', res.data.token);
                            uni.setStorageSync('uid', res.data.uid);
                            resolve(res);
                        } else {
                            uni.showToast({
                                title: res.msg,
                                icon: 'none'
                            });
                            reject(res.msg);
                        }
                    });
                } else {
                    console.log('----start  authorize ----------------');
                    WXAPI.authorize({
                        code: code,
                        referrer: referrer
                    }).then(function (res) {
                        if (res.code == 200) {
                            uni.setStorageSync('bestpw-Token', res.data.token);
                            uni.setStorageSync('uid', res.data.uid);
                            resolve(res);
                        } else {
                            uni.showToast({
                                title: res.msg,
                                icon: 'none'
                            });
                            reject(res.msg);
                        }
                    });
                }
            },
            fail: (err) => {
                reject(err);
            }
        });
    });
}
function loginOut() {
    uni.removeStorageSync('bestpw-Token');
    uni.removeStorageSync('uid');
}
async function checkAndAuthorize(scope) {
    return new Promise((resolve, reject) => {
        uni.getSetting({
            success(res) {
                if (!res.authSetting[scope]) {
                    uni.authorize({
                        scope: scope,
                        success() {
                            resolve(); // 无返回参数
                        },

                        fail(e) {
                            console.error(e);
                            // if (e.errMsg.indexof('auth deny') != -1) {
                            //   wx.showToast({
                            //     title: e.errMsg,
                            //     icon: 'none'
                            //   })
                            // }
                            uni.showModal({
                                title: '无权操作',
                                content: '需要获得您的授权',
                                showCancel: false,
                                confirmText: '立即授权',
                                confirmColor: '#e64340',
                                success(res) {
                                    uni.openSetting();
                                },
                                fail(e) {
                                    console.error(e);
                                    reject(e);
                                }
                            });
                        }
                    });
                } else {
                    resolve(); // 无返回参数
                }
            },

            fail(e) {
                console.error(e);
                reject(e);
            }
        });
    });
}
module.exports = {
    checkHasLogined: checkHasLogined,
    wxaCode: wxaCode,
    login: login,
    loginOut: loginOut,
    checkAndAuthorize: checkAndAuthorize,
    authorize: authorize,
    bindSeller: bindSeller
};
