/* webpack配置详解
----------第一节------------
webpack 配置详解-devServer


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
    mode: "development",
    devServer: {
        //运行代码的目录
        contentBase: resolve(__dirname, 'build'),
        // 监视contentBase目录下的所有文件， 一旦文件变化就会reload
        watchContentBase: true,
        watchOptions: {
            //监视文件的时候，忽略一些文件
            ignored: /node_modules/
        },
        // 启动gzip压缩
        compress: true,
        // 端口号
        port: 5000,
        // 域名
        host: 'localhost',
        // 自动打开浏览器
        open: true,
        // 开启HMR功能
        hot: true,
        // 当webpack-dev-server启动的时候，终端会输出webpack的各个步骤，这是我们不需要的。所以clientLogLevel的作用：不要显示启动服务器日志信息
        clientLogLevel: 'none',
        // 这个参数和clientLogLevel类似，所以作用是：除了一些基本启动信息之外，其他内容都不要显示
        quiet: true,
        // 如果出错了，不要全屏提示
        overlay: false,
        // 服务器你代理－>解决开发环境跨域问题
        // proxy: {
        //     // 一旦devServer(5000) 服务器接受到 / api / xxx的请求， 就会把请求转发到另一个服务器（ 3000）
        //     '/api': {
        //         target: 'http://localhost:3000',
        //         //发送请求时，请求路径重写：将/api/xxx -> /xxx (去掉/api)
        //         pathRewrite: {
        //             '^/api': ''
        //         }
        //     }
        // }
    }
};