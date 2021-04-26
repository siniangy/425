const webpack = require("webpack");
const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CompressionWebpackPlugin = require("compression-webpack-plugin");

module.exports = {
  entry: {
    app: "./src/page/app.js",
    vendor: ["react", "react-dom"]
  },
  devtool: false,
  // externals: { // 直接把echarts和jquery从package.json中去除了
  // 	"react": "window.React",
  // 	"react-dom": "window.ReactDom",
  // 	"echarts": "window.echarts",
  // 	"jquery": "window.jQuery"
  // },
  output: {
    path: path.join(__dirname, "./public/javascripts"),
    filename: "[name].js"
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        query: {
          presets: ["react", "es2015"]
        }
      },
      {
        test: /\.jsx$/,
        loader: "babel-loader",
        query: {
          presets: ["react", "es2015"]
        }
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      },
      {
        test: /\.less$/,
        loader: "style-loader!css-loader!less-loader"
      },
      {
        test: /\.(jpg|png|otf)$/,
        loader: "url?limit=8192"
      },
      {
        test: /\.scss$/,
        loader: "style!css!sass"
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "all"
        }
      }
    },
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: false
        }
      })
    ]
  },
  plugins: [
    new CompressionWebpackPlugin({
      filename: "[path].gz[query]",
      algorithm: "gzip",
      test: new RegExp("\\.(js|css)$"),
      threshold: 0,
      minRatio: 0.8
    })
  ]
};
