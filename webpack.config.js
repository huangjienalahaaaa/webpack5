/* 生产环境优化:
-----------第一节:-------------------
* oneOf:
    module/rules中的loader只会被处理一边.比如说项目中的css文件,当别cssloader处理完之后,就不需要再往下扫描其他的loader了.

    使用方法就是:module/urles中加oneOf:[],loader都放入oneOf:[]中.

    但是使用oneOf需要注意:不能有2项配置处理处理同一种类型文件.比如说下面的eslint-loader和babel-loader都是对js文件进行处理的,那么会出现一个问题:2个loader只会生效一个.那么怎么办呢?方法:我们需要把eslint-loader提取到oneOf之外即可,就ok了.->因为eslint-loader中有enforce:'pre',会优先执行.然后处理完之后,就会进入oneOf中,oneOf中只会匹配一个.

-----------第二节:-------------------
* 缓存(会从2个点出发,一个是对babel缓存,一个是对资源缓存):
    1. 对babel缓存:
        babel 缓存是什么意思呢? 就是我们在写代码的时候,我们永远都是js代码是最多的,像结构或者样式呢,要么少,要么很少,或者说要么不太多,而且即使多呢我们也没办法做更多的处理.那么为什么要对babel进行缓存呢,因为babel需要对我们写的js代码进行编译处理,编译一种我们浏览器能识别的语法,就是所谓的js的兼容性处理.比如说在编译过程中我们有100个js模块,但是我们只改动其中一个js模块,我们不可能把所有的模块再进行一次编译,其他的99个应该是不变的.这点呢跟我们之前的HRM功能一模一样:我们一个模块变,我们其他模块不变,而只变这一个模块.而在生产环境下呢我们又不能用HRM功能,因为HRM是基于devServer的,而生产环境是不需要devServer.而我们想做的事情就是:babel做这个翻译的时候,只有这个文件变,那么只需要这个文件变,其他文件是不变的.要想做到这一点,我们就要开启babel缓存:babel先对之前的100个文件编译后进行缓存处理,然后将来你再去编译的时候,发现文件没有变化,它就直接使用缓存了,而不会重新构建一次.

        怎么做呢?只需要在babel-loader中的options中,再加入一个参数 cacheDirectory: true 即可




 */
const {
    resolve
} = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");


process.env.NODE_ENV = "production"; //这里应该要改为production了


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
            // { //eslint语法检查
            //   test: /\.js$/,
            //   exclude: /node_modules/,
            //   loader: "eslint-loader",
            //   enforce: 'pre', 
            //   options: {
            //     fix: true
            //   }
            // },
            oneOf: [ //以下loader只会匹配一个
                {
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
                {
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
                        ],
                        cacheDirectory: true //开启babel缓存(第二次构件时,会读取之前的缓存,从而速度会更快)
                    }
                }
            ]
        }]
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
        port: 3000,
        hot: true
    },
    devtool: 'eval-source-map'
};