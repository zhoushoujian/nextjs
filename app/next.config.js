const withLess = require('@zeit/next-less')
module.exports = withLess()
// module.exports = withLess({
//   cssModules: true,
//   webpack: function (config) {
//     return config;
//   }
// });
