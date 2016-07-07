const path = require("path");
const webpack = require("webpack");
const autoprefixer = require("autoprefixer");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const config = module.exports = {
  //devtool: "source-map",
  devtool: "eval",
  entry: {
    application: [
      "webpack/hot/only-dev-server",
      path.resolve(__dirname, "app/js/app.js"),
      path.resolve(__dirname, "app/css/app.less"),
      path.resolve(__dirname, "app/index.html"),
    ],
  },

  output: {
    path: path.resolve(__dirname, "dst"),
    filename: "js/app.js",
  },

  resolve: {
    extensions: ["", ".js", ".less"],
    modulesDirectories: ["node_modules"],
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel",
      }, {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract("style", "css!postcss-loader!less"),
      }, {
        test: /\.png$/,
        loader: "url-loader?limit=10000",
      }, {
        test: /\.html$/,
        loader: "html-loader",
      },
    ],
  },

  postcss() {
    return [autoprefixer({ browsers: ["last 2 versions"] })];
  },

  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: `"${process.env.NODE_ENV}"`,
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin("css/app.css"),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.join(__dirname, "app/index.html"),
      inject: true,
    }),
  ],
};

if (process.env.NODE_ENV === "production") {
  config.plugins.push(
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({ minimize: true })
  );
}
