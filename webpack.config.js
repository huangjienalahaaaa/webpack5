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
        path: resolve(__dirname, "build")
    },

    module: {
        rules: [{
            test: /\.css$/,
            use: ["style-loader", "css-loader"]
        }]
    },
    plugins: [new HtmlWebpackPlugin({})],
    mode: "development",
    devServer: {
        //运行代码的目录
        contentBase: resolve(__dirname, "build"),
        // 监视contentBase目录下的所有文件，一旦文件变化就会reload
        watchContentBase: true,
        watchOptions: {
            //监视文件的时候，忽略一些文件
            ignored: /node_modules/
        },
        // 启动gzip压缩
        compress: true,
        // 端口号
        port: 5000,
        // 指定域名
        host: "localhost",
        // 自动打开浏览器
        open: true,
        // 开启HRM功能
        hot: true,
        //　在这个webpack-dev-server开启的时候，会出现很多的日志，说这个服务器运行到了哪个阶段啊，做了哪些事情啊，但是实际上我们是不需要的，所以这个选项表示：不显示启动服务器日志信息
        clientLogLevel: "none",
        //跟上面的clientLogLevel功能差不多：除了一些基本启动信息之外，其他内容都不显示。quiet和clientLogLevel相加之后，我们的webpack-dev-server基本上就不会显示太多的内容
        quiet: true,
        //如果出错了，不要全屏提示～
        overlay: false,
        // 服务器代理－>解决开发环境跨域问题
        proxy: {
            // 一旦devServer(5000)服务器接受到/api/xxx的请求，就会把请求转发到另外一个服务器(3000)
            '/api': {
                target: "http://localhost:3000",
                //发送请求时，请求路径重写：将 /api/xxx--->xxx (去掉/api)
                pathRewrite: {
                    "^/api": ""
                }
            }
        }
    }
};