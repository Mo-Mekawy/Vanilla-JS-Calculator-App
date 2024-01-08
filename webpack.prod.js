// add code autocomplete when writing configs
/** @type {import('webpack').Configuration} */

const { merge } = require("webpack-merge");
const common = require("./webpack.common");

module.exports = merge(common, {
  mode: "production",
});
