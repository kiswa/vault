module.exports = {
  productionSourceMap: false,

  devServer: {
    disableHostCheck: true
  },

  chainWebpack: config => {
    config.module.rule('vue')
      .use('vue-svg-inline-loader')
        .loader('vue-svg-inline-loader')
        .options({ svgo: { plugins: [{ removeTitle: false }] } })
  }
}
