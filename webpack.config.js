/*
---------第二节-----------------
    1. webpack.config.js  -> webpack的配置文件(作用:指示webpack干哪些活.也就是当你运行webpack指令时,会加载其中的配置)
    2. 请记住一句话:所有构建工具都是基于nodejs平台运行的~模块化采用common.js~
--------第三节-------------------
    1.loader和plugins过程:
        *  loader -> 1.下载   2.使用(配置loader)
        * plugins-> 1.下载  2. 引入 3.使用
 */

//resolve用来拼接绝对路径的方法
const { resolve } = require("path");

// 引入plugins:
const htmlWebpackPlugin = require("html-webpack-plugin");

// 因为模块化采用common.js
module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "build.js",
    path: resolve(__dirname, "build")
  },
  module: {
    //loader配置
    rules: [
      // 详细loader配置

      {
        //处理css文件
        test: /\.css$/,
        use: [
          "style-loader", // 创建style标签,将js中的样式资源插入进去,添加到页面中的head中生效
          "css-loader" // 将css文件变成commonjs模块,加载到js中,里面内容是样式字符串
        ]
      },
      {
        //处理less文件
        test: /\.less$/,
        use: [
          "style-loader",
          "css-loader",
          "less-loader" //将less文件编译成css文件
        ]
      },
      {
        //处理图片资源.但是这种方式有一个问题:处理不了html中的图片,所以下面还得加一个html-loader(但是这种方式会出现一个问题:[object Module],解决方法:关闭url-loader的es6模块化,使用commonjs解析!!但是我没有出现这个情况!!!!)
        test: /\.(jpg|png|gif)$/,
        //如果只使用一个loader,那么就可以直接写loader,那么这个loader的配置就可以使用那面的options来配置
        loader: "url-loader",
        options: {
          limit: 8 * 1024, //图片大小小于8kb,就会被base64处理(base64处理的优点:减少页面请求数量(减轻服务器压力).但是同样也存在缺点:缺点就是图片体积会更大(文件请求速度会慢一些))
          esModule: false //关闭解决上面的问题,虽然我没有这个问题(关闭url-loader的es6模块化,使用commonjs解析)
        }
      },
      {
        test: /\.html$/,
        //html-loader是用来处理html文件中的img图片(负责引入img,从而能被url-loader进行处理)
        loader: "html-loader"
      }
    ]
  },
  plugins: [
    // plugins配置

    //引入html-webpack-plugin(功能:默认会创建一个空的html,自动引入打包输出的所有资源(js/css))
    new htmlWebpackPlugin({
      //复制 ./src/index.html文件,并自动引入打包输出的所有资源(js/css)
      template: "./src/index.html"
    })
  ],
  //  模式
  //mode: 'production',
  mode: "development"
};
