/* webpack配置详解
----------第一节------------
webpack 配置详解-optimization


 */
const {
    resolve
} = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/js/index.js",
    output: {
        filename: "js/[name].js",
        path: resolve(__dirname, "build"),
    },

    module: {
        rules: [{
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }

        ]
    },
    plugins: [new HtmlWebpackPlugin({})],
    mode: "production", //optimization必须在生产环境下才有意义
    /*
        1.可以将node_modules中代码单独打包一个chunk最终输出
        ２．自动分析多入口chunk中，有没有公共的文件。如果有，会打包成一个单独的chunk
    */

    optimization: {
        splitChunks: { //是用来做代码分割的
            chunks: 'all',

            //注意，下面的值都是默认值，一般是不去修改的

            minSize: 30 * 1024, //分割的chunk最小为30kb:只有大于30kb我们才会去分割，如果小于30kb,我们就不会去分割了。
            maxSize: 0, //最大没有限制
            minChunks: 1, //要提取的chunk最少被引用１次
            maxAsyncRequests: 5, //按需加载时并行加载的数量的最大数量
            maxInitialRequests: 3, //入口js文件最大并行请求数量
            automaticNameDelimiter: '~', //名称连接符
            name: true, //可以使用命名规则，这个规则值上面的automaticNameDelimiter以及下面的cacheGroups
            cacheGroups: { //分割chunk的组

                // node_modules文件会被打包到vendors组的chunk中。－－> 所以这个chunk的名称为：vendors~xxx.js
                // 而且得满足上面的公共规则，如：大小超过30kb，至少被引用一次
                vendors: {
                    test: /[\\/][node_modules][\\/]/,
                    // 优先级
                    priority: -10
                },
                default: {
                    //要提取的chunk最少被引用２次
                    minChunks: 2,
                    // 优先级
                    priority: -20, //这里的优先级比－１０要低多了，表示你先处理完node_modules，再来处理我这个

                    // 如果当前要打包的模块，和之前已经被提取的模块是同一个，就会复用，而不是重新打包模块：比如说是多入口ａ和b，ａ入口引用是jquery。ｂ入口也引用jquery，但是jquery已经在a入口被打包了，那么就会提取出来为一个chunk，并且b入口那么这里就不需要去打包了，而是复用这个chunk。
                    reuseExistingChunk: true
                }

            }
        }
    }
};