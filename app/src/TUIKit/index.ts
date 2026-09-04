import { genTestUserSig } from './debug';
import Server from './server';
import TUIComponents, {
  TUIChat,
  TUIConversation,
  TUIContact,
  TUISearch,
  TUIGroup,
} from './components';
import TUIKit from './index.vue';
import { hideTUIChatFeatures } from './components/TUIChat/config';

const TUIChatKit = new Server();
// 防御(20260904):模块顶层init在app-plus环境异常会中断页面模块加载→整页白屏卡死,失败仅告警不阻断;H5行为不变
try {
  TUIChatKit.init();
} catch (e) {
  console.warn('[TUIKit] module init skipped:', e);
}

export {
  TUIKit,
  TUIChatKit,
  TUIComponents,
  TUIChat,
  TUIConversation,
  TUIContact,
  TUISearch,
  TUIGroup,
  hideTUIChatFeatures,
  genTestUserSig,
};
