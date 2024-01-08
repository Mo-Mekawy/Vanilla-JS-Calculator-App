// add code autocomplete when writing configs
/** @type {import('webpack').Configuration} */
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    main: "./src/index.js",
  },
  plugins: [new HtmlWebpackPlugin({ template: "./src/template.html" })],
  module: {
    rules: [
      {
        test: /\.html$/,
        use: "html-loader",
      },
      {
        test: /\.(woff|woff2|eot|ttf)$/i,
        type: "asset/resource",
        generator: {
          filename: "fonts/[name].[contenthash][ext]",
        },
      },
      {
        test: /\.(png|jpe?g|webp)$/i,
        type: "asset/resource",
        generator: {
          filename: "images/[name].[contenthash][ext]",
        },
      },
      {
        test: /\.(svg|gif)$/i,
        type: "asset/inline",
        generator: {
          filename: "images/[name].[contenthash][ext]",
        },
      },
    ],
  },
};
