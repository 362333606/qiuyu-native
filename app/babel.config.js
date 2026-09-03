// uni-app Vue2 CLI 官方模板同款 + TUIKit TS 支持
// overrides 强制对 .vue 内 lang=ts 的 script 剥类型（默认 @vue/app 只处理 .ts 后缀，
// SFC 虚拟模块路径不匹配导致 ref<number>() 泛型裸奔进 webpack）
const plugins = []

if (process.env.UNI_OPT_TREESHAKINGNG) {
  plugins.push(require('@dcloudio/vue-cli-plugin-uni-optimize/packages/babel-plugin-uni-api/index.js'))
}

module.exports = {
  presets: [
    [
      '@vue/app',
      {
        modules: 'commonjs',
        useBuiltIns: 'usage'
      }
    ]
  ],
  plugins,
  overrides: [
    {
      test: /\.vue$/,
      plugins: [
        [
          require('@babel/plugin-transform-typescript'),
          { isTSX: true, allowDeclareFields: true }
        ]
      ]
    }
  ]
}
