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
----------第五节--------------------
1. 可以看到:webpack有的工作会使用loader来做,有的工作呢会使用plugins来做.有个明显的规律就是:loader做事比较少,大部分工作都是靠插件plugins来完成,尤其是压缩啊这些东西,都是靠插件来完成的.而兼容性处理这些东西,是靠loader来完成

2. 压缩CSS:
  * 使用插件:optimize-css-assets-webpack-plugin


----------第六节--------------------
js语法检查:
  * 使用eslint-loader这个插件.但是这个依赖与eslint这个库,所以我们要下载这2个东西.
  * 语法检查只检查自己写的代码,第三方库(node_modules)是不检查的
  
----------第七节--------------------
js兼容性处理(将es6语法转化为es5以及以下的语法):
  * 使用:babel-loader(这里还要下载@babel/core,@babel/preset-env这两个库一起下载)
  
 */

const {
  resolve
} = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
// 提取CSS成单独文件:
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 压缩CSS:
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");

// 设置nodejs环境变量
process.env.NODE_ENV = "development";

module.exports = {
  entry: "./src/js/index.js",
  output: {
    filename: "js/build.js", //编译后将入口文件index.js文件放在js目录下.项目中的css文件,由于css-loader的原因,webpack会将css打包到js文件中了,所以不需要给css文件再指定输出路径了
    path: resolve(__dirname, "build")
  },
  module: {
    rules: [{
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
      },
      {
        //js兼容性处理
        test: /\.js$/,
        exclude: /node_modules/, //防止将第三方插件处理了
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"] //presets -> 预设,指示babel做怎么样的兼容性处理
        }
      }
      // {
      //   //语法检查,下面的配置配置完之后,还得写检查规则(这个去package.json中eslintConfig中设置~),且这里的规则我们推荐使用airbnb规则(为什么我们推荐使用airbnb规则呢?我们可以去github->Exolore->Topics->Javascript中选择airbnb / javascript查看风格指南,他会告诉你很多你该如何去写js代码,且可以在这个页面中可以看到这个页面是有中文翻译的),这里我们使用的是eslint-config-airbnb-base这个插件.但是这个插件,它还依赖于eslint-plugin-import和eslint这两个库,所以我们要下载3个库,但是这里我不使用eslint,所以想用的时候把下面的注释给删了就行
      //   test: /\.js$/, //只检查js代码
      //   exclude: /node_modules/, //排除第三方库
      //   loader: "eslint-loader",
      //   options: {
      //     fix: true //自动修复eslint错误
      //   }
      // },

    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    }),
    new MiniCssExtractPlugin({
      filename: "css/buid.css" //指定css的输出路径以及重命名
    }),
    new OptimizeCssAssetsPlugin() //压缩CSS
  ],

  mode: "development",

  devServer: {
    contentBase: resolve(__dirname, "build"),
    compress: true,
    open: true,
    port: 3000
  }
};