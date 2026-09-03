<template>
  <view class="page-container">
    <!-- 主容器 -->
    <view class="container">
      <!-- 头部区域 -->
      <view class="header">
        <view class="title">支付宝支付引导</view>
        <view class="desc">请在外部浏览器中完成支付</view>
      </view>

      <!-- 微信内引导步骤（仅微信环境显示） -->
      <view v-if="isWeixinEnv" class="steps-container">
        <view class="step" @click="handleStepHover($event)">
          <view class="step-number">1</view>
          <view class="step-content">
            <view class="step-title">点击右上角菜单</view>
            <view class="step-desc">点击微信右上角 <strong>···</strong> 按钮打开菜单</view>
          </view>
        </view>

        <view class="step" @click="handleStepHover($event)">
          <view class="step-number">2</view>
          <view class="step-content">
            <view class="step-title">选择浏览器打开</view>
            <view class="step-desc">在弹出的菜单中选择 <strong>"在浏览器打开"</strong> 选项</view>
          </view>
        </view>

        <view class="step" @click="handleStepHover($event)">
          <view class="step-number">3</view>
          <view class="step-content">
            <view class="step-title">完成支付 & 返回微信</view>
            <view class="step-desc">在浏览器完成支付宝支付后，返回微信并重新打开此页面</view>
          </view>
        </view>
      </view>

      <!-- 非微信环境：直接显示支付按钮 -->
      <view v-else class="non-weixin">
        <view class="non-weixin-tip">即将跳转到支付宝完成支付</view>
        <button class="pay-btn" @click="goToPay">立即前往支付</button>
      </view>

      <!-- 温馨提示 -->
      <view class="tips">
        <view class="tips-title">温馨提示</view>
        <view class="tips-content">
          <template v-if="isWeixinEnv">
            微信内无法直接使用支付宝支付，请按步骤在外部浏览器完成支付，再返回微信打开此页面确认支付状态。
          </template>
          <template v-else>
            点击「立即前往支付」按钮，将跳转至支付宝完成付款流程。
          </template>
        </view>
      </view>

    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      payUrl: '', // 支付链接
      isWeixinEnv: false, // 是否在微信环境
      pageVisitKey: 'alipay_guide_visit_count', // 本地存储key（标记页面访问次数）
      isPayUrlValid: true // 支付链接有效性标记
    };
  },
  onLoad(options) {
    // 1. 优先从页面参数获取支付链接（兼容UniApp路由参数）
	this.payUrl = this.getUrlCodeParam('payUrl') ? decodeURIComponent(this.getUrlCodeParam('payUrl')) : '';
    
    // 2. 验证支付链接有效性
    this.checkPayUrlValid();

    // 3. 检测当前环境（微信/非微信）
    this.checkWeixinEnv();

    // 4. 非微信环境：直接跳转支付（若链接有效）
    if (!this.isWeixinEnv && this.isPayUrlValid) {
      this.goToPay();
    }
  },
  onShow() {
    // 页面显示时：仅微信环境 + 二次访问（从外部浏览器返回）才触发弹窗
    if (this.isWeixinEnv && this.isPayUrlValid) {
      this.handleCheckVisitCount();
    }
  },
  onUnload() {
    // 页面卸载时：清除本地存储（避免其他场景干扰）
    uni.removeStorageSync(this.pageVisitKey);
  },
  methods: {
    /**
     * 检测页面访问次数：控制二次打开时弹窗
     */
    handleCheckVisitCount() {
      // 获取本地存储的访问次数（默认0）
      const visitCount = Number(uni.getStorageSync(this.pageVisitKey)) || 0;

      if (visitCount === 1) {
        // 二次访问（第一次从浏览器返回）：延迟弹窗（避免页面加载卡顿）
        setTimeout(() => {
          this.showPaymentModal();
          // 弹窗后重置计数（避免重复触发）
          uni.setStorageSync(this.pageVisitKey, 0);
        }, 800);
      } else {
        // 首次访问：记录次数为1（标记为“已首次打开”）
        uni.setStorageSync(this.pageVisitKey, 1);
      }
    },

    /**
     * 支付确认弹窗
     */
    showPaymentModal() {
      uni.showModal({
        title: '确认支付状态',
        content: '您是否已在外部浏览器完成支付宝支付？',
        confirmText: '已完成支付',
        cancelText: '未支付',
        confirmColor: '#1677FF',
        cancelColor: '#666666',
        success: (res) => {
          if (res.confirm) {
            // 用户确认已支付：返回上一页（或首页）
            this.handleGoBack();
          } else {
            // 用户未支付：提示继续完成支付
            uni.showToast({
              title: '请在外部浏览器完成支付后再返回确认',
              icon: 'none',
              duration: 2000,
              mask: true
            });
          }
        }
      });
    },

    /**
     * 返回上一页/首页逻辑
     */
    handleGoBack() {
      const pages = getCurrentPages();
      if (pages.length > 1) {
        // 有上一页：返回上一页
        uni.navigateBack({ delta: 1, animationType: 'slide-out-right' });
      } else {
        // 无对应上一页：跳转首页（可根据实际需求修改路径）
        uni.switchTab({ 
          url: '/pages/chat/index',
          animationType: 'slide-in-right'
        });
      }
    },

    /**
     * 从URL哈希中获取参数（兼容H5路由哈希模式）
     */
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
	},

    /**
     * 检测是否为微信环境（精准匹配微信内置浏览器）
     */
    checkWeixinEnv() {
	  const ua = navigator.userAgent.toLowerCase();
	  this.isWeixinEnv = ua.indexOf('micromessenger') !== -1;
	},

    /**
     * 验证支付链接有效性
     */
    checkPayUrlValid() {
      // 简单验证：是否为http/https链接 + 包含支付宝相关域名（可根据实际支付链接调整）
      const alipayDomainReg = /alipay|alipay.com|alipay.cn/;
      this.isPayUrlValid = !!this.payUrl 
        && /^https?:\/\/.+/.test(this.payUrl) 
        && alipayDomainReg.test(this.payUrl);

      // 无效链接提示
      if (!this.isPayUrlValid) {
        uni.showToast({
          title: '支付链接无效，请重新获取',
          icon: 'none',
          duration: 2000,
          mask: true
        });
      }
    },

    /**
     * 跳转支付宝支付（非微信环境）
     */
    goToPay() {
      if (!this.isPayUrlValid) return;

      try {
		window.location.href = this.payUrl;
        
        // 提示用户关注支付结果
        uni.showToast({
          title: '已跳转至支付宝，请完成支付',
          icon: 'none',
          duration: 1500
        });
      } catch (error) {
        // 异常处理：若新窗口被拦截，直接替换当前页
        window.location.href = this.payUrl;
      }
    },

    /**
     * 步骤卡片点击反馈（模拟hover效果，提升交互感）
     */
    handleStepHover(e) {
      const stepEl = e.currentTarget;
      stepEl.classList.add('step-hover');
      setTimeout(() => {
        stepEl.classList.remove('step-hover');
      }, 300);
    }
  }
};
</script>

<style scoped>
/* 基础布局优化：提升移动端适配性 */
.page-container {
  padding: 20px 16px;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: #fafafa;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 主容器：卡片化设计，增强视觉层次 */
.container {
  width: 100%;
  max-width: 480px;
  background-color: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
}

/* 头部区域：文字层级优化 */
.header {
  text-align: center;
  margin-bottom: 32px;
}

.title {
  font-size: 22px;
  font-weight: 700;
  color: #1d2129;
  margin-bottom: 8px;
}

.desc {
  font-size: 15px;
  color: #6e7175;
}

/* 步骤容器：间距优化，增强引导性 */
.steps-container {
  margin-bottom: 32px;
}

.step {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  border-radius: 12px;
  background-color: #f8faff;
  margin-bottom: 16px;
  transition: all 0.2s ease;
  cursor: pointer;
}

/* 步骤点击反馈效果 */
.step-hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(22, 119, 255, 0.1);
  background-color: #f0f7ff;
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1677ff 0%, #36cfc9 100%);
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(22, 119, 255, 0.3);
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 17px;
  font-weight: 600;
  color: #1d2129;
  margin-bottom: 4px;
}

.step-desc {
  font-size: 14px;
  color: #6e7175;
  line-height: 1.5;
}

/* 非微信环境：支付按钮样式优化 */
.non-weixin {
  text-align: center;
  margin-bottom: 32px;
}

.non-weixin-tip {
  font-size: 15px;
  color: #1d2129;
  margin-bottom: 16px;
}

.pay-btn {
  width: 100%;
  height: 48px;
  background-color: #1677ff;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  border-radius: 24px;
  border: none;
  transition: background-color 0.2s ease;
}

.pay-btn:hover {
  background-color: #0f62d9;
}

/* 温馨提示：颜色与图标结合，增强可读性 */
.tips {
  padding: 16px;
  border-radius: 12px;
  background-color: #f0f7ff;
  border-left: 4px solid #1677ff;
  box-sizing: border-box;
}

.tips-title {
  font-size: 16px;
  font-weight: 600;
  color: #1677ff;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
}

.tips-title::before {
  content: "!";
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #1677ff;
  color: #fff;
  font-size: 14px;
  text-align: center;
  line-height: 20px;
  margin-right: 8px;
}

.tips-content {
  font-size: 14px;
  color: #4e5969;
  line-height: 1.6;
}

/* 小屏幕适配（375px以下） */
@media (max-width: 375px) {
  .container {
    padding: 20px 16px;
  }

  .step {
    padding: 14px;
  }

  .title {
    font-size: 20px;
  }

  .pay-btn {
    height: 44px;
    font-size: 15px;
  }
}
</style>