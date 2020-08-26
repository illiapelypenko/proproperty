const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const htmlPlugin = new HtmlWebpackPlugin({
  template: "./src/index.html",
  filename: "./index.html",
});

module.exports = {
  entry: ["babel-polyfill", "./src/index.js"],
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
  },
  devtool: "inline-source-map",
  plugins: [htmlPlugin],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      // {
      //   test: /\.(png|svg|jpg|gif)$/,
      //   use: ["file-loader"],
      // },
      // {
      //   test: /\.html$/i,
      //   loader: "html-loader",
      // },
      // {
      //   test: /\.svg$/,
      //   loader: "svg-inline-loader",
      // },
    ],
  },
  resolve: {
    extensions: [".js"],
  },
};
