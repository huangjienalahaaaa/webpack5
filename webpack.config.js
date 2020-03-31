/* webpack配置详解
----------第一节------------
webpack配置详解-devServer:

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
        // 监视contentBase目录下的所有文件，一旦文件变化就会reload
        watchContentBase: true,
        watchOptions: {
            //忽略文件
            ignored: /node_modules/
        },
        //启动gzip压缩
        compress: true,
        //端口号
        port: 5000,
        // 域名
        host: 'localhost',
        // 自动打开浏览器
        open: true,
        //开启HRM功能

    }
};