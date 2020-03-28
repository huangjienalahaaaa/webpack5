/*
--------第1节-------------------
1. 比如下面的eslint和babel-loader插件都是要对js文件进行处理,而正常来讲,一个文件只能被一个Loader处理:
  那么当一个文件要被多个loader处理,那么一定要指定loader执行的先后顺序:
    这里必须要先执行eslint进行语法检查,再执行babel转换,那么如何保证这个顺序呢???:
      * 在eslint-loader中再加入一个属性:enforce:'pre'->优先执行的意思,就是加了这个属性后,所有的loader,一定是这个loader先执行,不管它是放在上面还是下面

--------第2节-------------------
webpack性能优化介绍:
  这个放在了README.md中了!!

--------第3节-------------------
优化开发环境的速度(mode 要改为development):
* 1.问题:在开发环境下,要使用npx webpack-dev-server来打包编译项目.但是比如你在更改其中一个css文件的时候,会发现整个项目的所有模块会重新打包一次,所以我们想要:"一个模块发生变化,只会重新打包这一个模块,而不是打包所有模块",这样可以帮我们极大的提升代码的构建速度
    * HMR:hot module replacement 热模块替换/模块热替换:
      那么如何实现呢?????->非常简单:只需要在下面devServer{}选项中,写如一条"hot:true"即可.
      修改完之后,要注意:"当修改了webpack配置,新配置要想生效,必须重新重新启动webpack服务",所以按ctrl+c,然后重新执行npx webpack-dev-server命令.:
    * 注意,因为这里npx webpack-dev-server这个命令是在开发环境使用的,所以在西面的commobCssLoader中的 MiniCssExtractPlugin.loader要改"styel-loader",不然的话是不会实时刷新的,MiniCssExtractPlugin.loade是在生产环境下再改回来,这里的开发环境要用style-loader:
    测试此时可知:
      1.样式文件:可以使用HMR功能:因为style-loader内部实现了,也就是上面的注意.!!这也就是为什么我们开发环境用的是style-loader,而生产环境得提取单个文件.因为开发环境我们使用style-loader,可以让我们性能更好,打包速度更快.但是上线的时候我们得考虑性能的优化.

      2.js文件:因为修改一个js文件,整体页面又重新加载,所以可以推断出:js文件是没有HMR功能的
      * 那么如何让js文件支持HRM功能呢? -> 需要修改js代码,添加支持HRM功能的代码-> 请看src/index.js中js的HRM功能这一块代码
      * 注意:HRM功能对js的处理,只能处理非入口js文件的其它js文件.为什么呢?因为入口js文件是引入所有js文件的,如果任何一个非入口的js文件修改,入口文件必须要修改的,这个是必须的~!

      3.html文件:修改Html文件,会发现跟修改js文件一样,是没有HRM功能的.同时会导致问题:html文件不能热更新了(既html文件修改了,不能自动更新html页面了)!!!!!
    * 如何解决上述html不能热更新问题-> 把html的入口文件加入到module.exports中的entry选项中即可.
      上面这条解决了html不能热更新的问题,但是此时HRM功能html还是不支持的,怎么办呢??-> 因为开发的时候只会生产出一个html文件的,所以一个变化就是所有的变化,所以也不需要HRM这个功能.


* 2. 解决开发环境下如何去调试代码->source-map:
      1.souce-map是什么呢??请看README.md中的这块部分.
      2.souce-map如何实现?? 只需要在这个文件下面加入一句话:devtool:'source-map'即可.然后执行webpack指令,它就会生成一个文件(在build/js/build.js.map文件)
      3.devtool:'source-map'只是source-map最基本的配置,它还有别的配置,请看README.md中对应的内容.注意:这里之后的具体使用请看视频,我这边值做笔记!!!
*/

const {
  resolve
} = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");


process.env.NODE_ENV = "development"; //这里应该要改为production了





// 因为css和less的use中的有些loader是重复的,所以我们这里定义复用loader,css和less中的use利用三点运算符...commonCssLoader引入即可
const commonCssLoader = [
  "style-loader",
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
  entry: ["./src/js/index.js", "./src/index.html"],
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
      // { //eslint语法检查
      //   test: /\.js$/,
      //   exclude: /node_modules/,
      //   loader: "eslint-loader",
      //   enforce: 'pre', //优先执行
      //   options: {
      //     fix: true
      //   }
      // },
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

  mode: 'development', //这里应该要改为production了

  devServer: {
    contentBase: resolve(__dirname, "build"),
    compress: true,
    open: true,
    port: 3000,
    hot: true //开启HMR热模块替换功能
  },
  devtool: 'eval-source-map' //souce-map技术
};