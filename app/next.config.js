const withLess = require('@zeit/next-less');
const withCss = require('@zeit/next-css');
const withPlugins = require('next-compose-plugins');

module.exports = withPlugins([withCss, withLess], {
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  cssModules: true,
  cssLoaderOptions: {
    camelCase: true,
    localIdentName: '[local]___[hash:base64:5]',
  },
  webpack(config) {
    return config;
  },
});
