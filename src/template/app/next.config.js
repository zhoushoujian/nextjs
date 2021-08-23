const withLessExcludeAntd = require('./next-less.config');

if (typeof require !== 'undefined') {
  require.extensions['.less'] = () => {};
}

module.exports = withLessExcludeAntd({
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: '[local]___[hash:base64:5]',
  },
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  webpack(config) {
    return config;
  },
});
