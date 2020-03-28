/*
--------第1节-------------------
1. 比如下面的eslint和babel-loader插件都是要对js文件进行处理,而正常来讲,一个文件只能被一个Loader处理:
  那么当一个文件要被多个loader处理,那么一定要指定loader执行的先后顺序:
    这里必须要先执行eslint进行语法检查,再执行babel转换,那么如何保证这个顺序呢???:
      * 在eslint-loader中再加入一个属性:enforce:'pre'->优先执行的意思,就是加了这个属性后,所有的loader,一定是这个loader先执行,不管它是放在上面还是下面

--------第2节-------------------
webpack性能优化介绍:
  这个放在了README.md中了!!


  */

const {
  resolve
} = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");


process.env.NODE_ENV = "production"; //这里应该要改为production了





// 因为css和less的use中的有些loader是重复的,所以我们这里定义复用loader,css和less中的use利用三点运算符...commonCssLoader引入即可
const commonCssLoader = [
  MiniCssExtractPlugin.loader,
  "css-loader",
  {
    loader: "postcss-loader",
    options: {
      ident: "postcss",
      plugins: () => [
        require("postcss-preset-env")()
      ]
    }
  }
]

module.exports = {
  entry: "./src/js/index.js",
  output: {
    filename: "js/build.js",
    path: resolve(__dirname, "build")
  },
  module: {
    rules: [{
        test: /\.css$/,
        use: [...commonCssLoader]
      },
      {
        test: /\.less$/,
        use: [
          ...commonCssLoader,
          "less-loader"
        ]
      },
      {
        test: /\.(jpg|png|gif)$/,
        loader: "url-loader",
        options: {
          limit: 8 * 1024,
          esModule: false,
          name: "[hash:10].[ext]",
          outputPath: "imgs"
        }
      },
      {
        test: /\.html$/,
        loader: "html-loader"
      },
      {
        exclude: /\.(css|js|html|less|jpg|png|gif)$/,
        loader: "file-loader",
        options: {
          name: "[hash:10].[ext]",
          outputPath: "media"
        }
      },
      { //eslint语法检查
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
        enforce: 'pre', //优先执行
        options: {
          fix: true
        }
      },
      { //babel转换
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: [
            [
              "@babel/preset-env",
              {

                useBuiltIns: "usage",

                corejs: {
                  version: 3
                },

                targets: {
                  chrome: "60",
                  firefox: "60",
                  ie: "9",
                  safari: "10",
                  edge: "17"
                }
              }
            ]
          ]
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      minify: {
        collapseWhitespace: true,
        removeComments: true
      }
    }),
    new MiniCssExtractPlugin({
      filename: "css/buid.css"
    }),
    new OptimizeCssAssetsPlugin()
  ],

  mode: 'production', //这里应该要改为production了

  devServer: {
    contentBase: resolve(__dirname, "build"),
    compress: true,
    open: true,
    port: 3000
  }
};