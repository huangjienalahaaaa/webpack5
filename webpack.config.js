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
            minSize: 30 * 1024, //分割的chunk最小为30kb
            maxSize: 0, //最大没有限制
            minChunks: 1, //要提取的chunk最少被引用１次
            maxAsyncRequests: 5, //按需加载时并行加载的数量的最大数量
            maxInitialRequests: 3, //入口js文件最大并行请求数量
            automaticNameDelimiter: '~', //名称连接符
            name: true, //可以使用命名规则
            cacheGroups: { //分割chunk的组
                // node_modules文件会被打包到vendors组的chunk中。－－> vendors~xxx.js
                // 满足上面的公共规则，如：大小超过30kb，至少被引用一次
                vendors: {
                    test: /[\\/][node_modules][\\/]/,
                    // 优先级
                    priority: -10
                },
                default: {
                    //要提取的chunk最少被引用２次
                    minChunks: 2,
                    // 优先级
                    priority: -20,
                    // 如果当前要打包的模块，和之前已经被提取的模块是同一个，就会复用，而不是重新打包哦模块
                    reuseExistingChunk: true
                }

            }
        }
    }
};