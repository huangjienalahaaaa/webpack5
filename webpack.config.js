/*
--------第1节-------------------
    1.开发环境配置:能让代码运行即可
 */

const {
    resolve
} = require("path");

const htmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "build.js",
        path: resolve(__dirname, "build")
    },
    module: {
        rules: [

            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            },
            {
                //处理less文件
                test: /\.less$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "less-loader"
                ]
            },
            {

                test: /\.(jpg|png|gif)$/,
                loader: "url-loader",
                options: {
                    limit: 8 * 1024,
                    esModule: false,
                    name: "[hash:10].[ext]"
                }
            },
            {
                test: /\.html$/,
                loader: "html-loader"
            },
            {
                exclude: /\.(css|js|html|less|jpg|png|gif)$/,
                loader: "file-loader"
            }
        ]
    },
    plugins: [
        new htmlWebpackPlugin({
            template: "./src/index.html"
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