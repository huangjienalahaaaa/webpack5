/* 生产环境优化:
-----------第一节:-------------------
* oneOf:
    module/rules中的loader只会被处理一边.比如说项目中的css文件,当别cssloader处理完之后,就不需要再往下扫描其他的loader了.

    使用方法就是:module/urles中加oneOf:[],loader都放入oneOf:[]中.

    但是使用oneOf需要注意:不能有2项配置处理处理同一种类型文件.比如说下面的eslint-loader和babel-loader都是对js文件进行处理的,那么会出现一个问题:2个loader只会生效一个.那么怎么办呢?方法:我们需要把eslint-loader提取到oneOf之外即可,就ok了.->因为eslint-loader中有enforce:'pre',会优先执行.然后处理完之后,就会进入oneOf中,oneOf中只会匹配一个.

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
                        ]
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