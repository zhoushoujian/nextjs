/** @format */

const withLess = require("@zeit/next-less");
const withCss = require("@zeit/next-css");
const withPlugins = require("next-compose-plugins");
const path = require("path");

module.exports = withPlugins([withLess, withCss], {
  cssModules: false,
  cssLoaderOptions: {
    camelCase: true,
    localIdentName: "[local]___[hash:base64:5]",
  },
});
