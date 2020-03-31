/* webpack配置详解
----------第一节------------
webpack详细配置之module:

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
        rules: [
            // 在这里写loader的配置
            {
                test: /\.css$/,
                // 多个Loader用use
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.js$/,
                //排除node_module下的js文件
                exclude: /node_modules/,
                //只检查src下的js文件
                include: resolve(__dirname, "src"),
                // 单个Loader可以直接用loader去写,然后在options来写这个loader的配置选项
                loader: 'eslint-loader',
                options: {},
                //优先执行
                enforce: 'pre', //值为'pre'表示优先执行,值为'post'表示延后执行.如果这个选项不写的话,就表示中间执行
            },
            {
                //oneOf:以下配置只会生效一个
                oneOf: []
            }
        ]
    },



    plugins: [new HtmlWebpackPlugin({})],
    mode: "development"
};