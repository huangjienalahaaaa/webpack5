/*
--------第1节-------------------
  1.开发环境配置:能让代码运行即可:
      运行指令:
        * webpack:会将打包结果输出出去
        * npx webpack-dev-server :只会在内存中编译打包,没有输出
--------第2节.构建环境的介绍:-------------------
  1.开发环境:
    源代码 -> webpack(自动) -> bundle
  2.生产环境:
    * 生产环境中的css-> js会出现"大,闪"问题,所以我们要将js中的css给提取出来
    * 代码压缩
    * 代码兼容性问题
----------第三节--------------------
提取CSS成单独文件:
  使用插件:mini-css-extract-plugin(使用webpack编译打包后,可以看到build文件夹中多出了main.css这个文件,这个就是提取出来的css.此时打开build文件夹下面的index.html文件,可以看到,这个文件自动引入了所有编译打包后的文件,包括这个css文件).
  如果要将打包后的这个main.css进行改名或者更改输入路径,在plugins中的new MiniCssExtractPlugin中的filename进行设置
----------第四节--------------------
css兼容性处理:
  * 使用postcss这个库:
    但是postcss要想在webpack中使用的话,得使用postcss-loader以及一个插件postcss-preset-env(这个插件能够帮助postcss识别某个环境,而加载制定的配置,能让我们的兼容性精确到某一个浏览器的版本)
  * 在module的css这个rule中进行配置.
 */

const { resolve } = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
// 提取CSS成单独文件:
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// 设置nodejs环境变量
process.env.NODE_ENV = "development";

module.exports = {
  entry: "./src/js/index.js",
  output: {
    filename: "js/build.js", //编译后将入口文件index.js文件放在js目录下.项目中的css文件,由于css-loader的原因,webpack会将css打包到js文件中了,所以不需要给css文件再指定输出路径了
    path: resolve(__dirname, "build")
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // "style-loader", //创建style标签,讲样式放入.但是这里要将css荣js文件中拿出来,所以这个loader我们就不要了,使用下面的MiniCssExtractPlugin,它其中有专门的.loader来处理
          MiniCssExtractPlugin.loader,
          "css-loader", //将css文件整合到js文件夹中.
          {
            //css兼容性处理
            loader: "postcss-loader",
            options: {
              ident: "postcss",
              plugins: () => [
                //postcss的插件->使用postcss-preset-env(!!!这个插件是用来:帮助postcss找到package.json中browserslist里面的配置,通过配置加载指定的css兼容性样式.所以接下来我们要去package.json中去写browserslist:但是package.json中是不能注释的,所以写在了learnImg中的1.png中)
                require("postcss-preset-env")()
              ]
            }
          }
        ]
      },
      {
        test: /\.(jpg|png|gif)$/,
        loader: "url-loader",
        options: {
          limit: 8 * 1024,
          esModule: false,
          name: "[hash:10].[ext]",
          outputPath: "imgs" //编译后将图片文件放在imgs目录下
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
          outputPath: "media" //编译后将其他资源放在media目录下
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    }),
    new MiniCssExtractPlugin({
      filename: "css/buid.css" //指定css的输出路径以及重命名
    })
  ],

  mode: "development",

  devServer: {
    contentBase: resolve(__dirname, "build"),
    compress: true,
    open: true,
    port: 3000
  }
};
