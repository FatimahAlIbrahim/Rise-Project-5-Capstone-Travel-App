const path = require("path");
const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
//const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  mode: "production",
  entry: "./src/client/index.js",
  optimization: {
    minimizer: [new TerserPlugin({}), new CssMinimizerWebpackPlugin({})],
    },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
          test: /\.(png|jp(e*)g|svg)$/,  
          use: [{
              loader: 'url-loader',
              options: { 
                  limit: 8000,
                  name: 'images/[hash]-[name].[ext]'
              } 
          }]
      }
    ],
  },
  output: {
    libraryTarget: "var",
    library: "Client",
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/client/views/index.html",
      filename: "./index.html",
    }),
    new MiniCssExtractPlugin({filename: "[name].css"}),
    //new WorkboxPlugin.GenerateSW()
  ],
};
