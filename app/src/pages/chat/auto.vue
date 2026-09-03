<template>
  <view class="container">
    <!-- 消息列表区域 -->
    <scroll-view 
      class="message-list" 
      scroll-y 
      :scroll-top="scrollTop"
      scroll-with-animation
    >
      <view 
        v-for="(msg, index) in messages" 
        :key="index"
        class="message-item"
        :class="[msg.sender === 'me' ? 'me' : 'other']"
      >
        <view class="message-content">
          {{ msg.content }}
        </view>
        <view class="message-time">
          {{ formatTime(msg.time) }}
        </view>
      </view>
    </scroll-view>

    <!-- 输入区域 -->
    <view class="input-area">
      <input 
        class="input-box" 
        v-model="inputMessage" 
        placeholder="输入消息..."
        confirm-type="send"
        @confirm="sendMessage"
      />
      <button 
        class="send-btn" 
        :disabled="!inputMessage" 
        @click="sendMessage"
      >发送</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      messages: [
        { sender: 'other', content: '你好！最近怎么样？', time: new Date(Date.now() - 60000) },
        { sender: 'me', content: '还不错，项目进展顺利！', time: new Date(Date.now() - 30000) },
        { sender: 'other', content: '太好了，下午有空讨论新需求吗？', time: new Date(Date.now() - 10000) }
      ],
      inputMessage: '',
      scrollTop: 0
    };
  },
  methods: {
    sendMessage() {
      if (!this.inputMessage.trim()) return;
      
      const newMessage = {
        sender: 'me',
        content: this.inputMessage,
        time: new Date()
      };
      
      this.messages.push(newMessage);
      this.inputMessage = '';
      
      // 滚动到底部
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
    scrollToBottom() {
      // 设置一个足够大的值确保滚动到底部
      this.scrollTop = 99999;
    },
    formatTime(date) {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}

.message-list {
  flex: 1;
  padding: 20rpx;
  overflow: auto;
  box-sizing: border-box;
}

.message-item {
  margin-bottom: 30rpx;
  max-width: 80%;
  clear: both;
}

.message-item.me {
  float: right;
}

.message-item.other {
  float: left;
}

.message-content {
  padding: 20rpx;
  border-radius: 10rpx;
  font-size: 32rpx;
  line-height: 1.5;
  position: relative;
}

.message-item.me .message-content {
  background-color: #95ec69;
  border-top-right-radius: 0;
}

.message-item.other .message-content {
  background-color: #ffffff;
  border-top-left-radius: 0;
}

.message-time {
  font-size: 24rpx;
  color: #999;
  text-align: center;
  margin-top: 10rpx;
}

.input-area {
  display: flex;
  padding: 20rpx;
  background-color: #fff;
  border-top: 1rpx solid #eee;
  align-items: center;
}

.input-box {
  flex: 1;
  height: 80rpx;
  background-color: #f9f9f9;
  border-radius: 40rpx;
  padding: 0 30rpx;
  font-size: 32rpx;
}

.send-btn {
  width: 140rpx;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 40rpx;
  margin-left: 20rpx;
  font-size: 32rpx;
  background-color: #07c160;
  color: white;
}

.send-btn:disabled {
  background-color: #cccccc;
}
</style>