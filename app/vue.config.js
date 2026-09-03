const path = require('path');
const ScriptSetup = require('unplugin-vue2-script-setup/webpack').default;

module.exports = {
  parallel: false,
  configureWebpack: {
    plugins: [
      ScriptSetup({
        /* options */
      }),
    ],
    resolve: {
      alias: {
        // 强制走 uni 魔改版（会生成 recyclableRender/components 导出），
        // 防止解析到 npm 官方 @vue/component-compiler-utils 导致模板导出缺变量
        '@vue/component-compiler-utils': path.resolve(
          __dirname,
          'node_modules/@dcloudio/vue-cli-plugin-uni/packages/@vue/component-compiler-utils'
        ),
      },
    },
  },
  chainWebpack(config) {
    // disable type check and let `vue-tsc` handles it
    config.plugins.delete('fork-ts-checker');
  },
};
