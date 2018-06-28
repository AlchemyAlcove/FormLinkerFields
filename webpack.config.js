const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require("html-webpack-plugin");
const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const path = require("path");
const webpack = require("webpack");

module.exports = (env, argv) => {
  const plugins = [
    new LodashModuleReplacementPlugin({
      "cloning": true,
      "collections": true,
      "paths": true,
      "shorthands": true
    }),
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname,"assets/webpack_template.html"),
      filename: "index.html",
      inject: "body"
    })
  ];

  if(env.production) {
    plugins.push(
      new CleanWebpackPlugin(["public"])
    )
  }
  if(env.performance) {
    plugins.push(
      new BundleAnalyzerPlugin()
    )
  }

  return {
    mode: env.production ? "production" : "development",
    devServer: {
      historyApiFallback: true,
      port: 3324
    },
    devtool: env.production ? false : "cheap-module-eval-source-map",
    entry: {
      flexitem: ["babel-polyfill", "./src/index.js"],
      demo: ["./demo/app.js"]
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            { loader: "babel-loader" },
            {
              loader: "eslint-loader",
              options: {
                emitWarning: true,
                failOnWarning: false
              }
            }
          ]
        }, {
          test: /\.style.js$/,
          exclude: /node_modules/,
          loader: "stylelint-custom-processor-loader",
          options: {
            emitWarning: true
          }
        }, {
          test: /\.(svg|png|gif|jpe?g)$/,
          exclude: /node_modules/,
          use: [{
            loader: "file-loader",
            options: {
              name: "[name].[ext]"
            }
          }]
        }
      ]
    },
    optimization: {
      minimize: (env.production ? true : false),
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            ecma: 5,
            output: {
              ascii_only: true 
            }
          }
        })
      ],
      runtimeChunk: "single",
      splitChunks: {
        cacheGroups: {
            commons: {
                name: "commons",
                chunks: "initial",
                minChunks: 2
            }
        }
      }
    },
    output: {
      filename: env.production ? "[name].[chunkhash].js" : "[name].bundle.js",
      path: path.join(__dirname, "public")
    },
    plugins: plugins
  }
};