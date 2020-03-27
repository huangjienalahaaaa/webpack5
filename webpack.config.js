/*
---------第二节-----------------
    1. webpack.config.js  -> webpack的配置文件(作用:指示webpack干哪些活.也就是当你运行webpack指令时,会加载其中的配置)
    2. 请记住一句话:所有构建工具都是基于nodejs平台运行的~模块化采用common.js~
--------第三节-------------------
    1.loader和plugins过程:
        *  loader -> 1.下载   2.使用(配置loader)
        * plugins-> 1.下载  2. 引入 3.使用
 */

//resolve用来拼接绝对路径的方法
const {
    resolve
} = require("path");

// 引入plugins:
const htmlWebpackPlugin = require("html-webpack-plugin");

// 因为模块化采用common.js
module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "build.js",
        path: resolve(__dirname, "build")
    },
    module: {
        //loader配置
        rules: [
            // 详细loader配置

            {
                //处理css文件
                test: /\.css$/,
                use: [
                    "style-loader", // 创建style标签,将js中的样式资源插入进去,添加到页面中的head中生效
                    "css-loader" // 将css文件变成commonjs模块,加载到js中,里面内容是样式字符串
                ]
            },
            {
                //处理less文件
                test: /\.less$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "less-loader" //将less文件编译成css文件
                ]
            },
            {
                //处理图片资源.但是这种方式有一个问题:处理不了html中的图片,所以下面还得加一个html-loader(但是这种方式会出现一个问题:[object Module],解决方法:关闭url-loader的es6模块化,使用commonjs解析!!但是我没有出现这个情况!!!!)
                test: /\.(jpg|png|gif)$/,
                //如果只使用一个loader,那么就可以直接写loader,那么这个loader的配置就可以使用那面的options来配置
                loader: "url-loader", //但是这里要下载2个包,url-loader以及file-loader
                options: {
                    limit: 8 * 1024, //图片大小小于8kb,就会被base64处理(base64处理的优点:减少页面请求数量(减轻服务器压力).但是同样也存在缺点:缺点就是图片体积会更大(文件请求速度会慢一些))
                    esModule: false, //关闭解决上面的问题,虽然我没有这个问题(关闭url-loader的es6模块化,使用commonjs解析)
                    name: "[hash:10].[ext]" //给文件取名字:[hash:10]取文件的hash的前10位,[ext]取文件原来扩展名
                }
            },
            {
                test: /\.html$/,
                //html-loader是用来处理html文件中的img图片(负责引入img,从而能被url-loader进行处理)
                loader: "html-loader"
            },
            {
                //打包其他资源(除了html/js/css资源以外的资源,所以下面用exclude来排除这些资源)
                // 注意:这里的实例是用阿里云的图标,这里用到的时候自己再看,我这边没有写案例
                exclude: /\.(css|js|html|less|jpg|png|gif)$/, //排除html/js/css资源,
                loader: "file-loader" //你会发现filr-loader和url-loader差不多的是.是的,因为url-loader是在file-loader的基础上面.进行了优化,添加了一个limit的功能
            }
        ]
    },
    plugins: [
        // plugins配置

        //引入html-webpack-plugin(功能:默认会创建一个空的html,自动引入打包输出的所有资源(js/css))
        new htmlWebpackPlugin({
            //复制 ./src/index.html文件,并自动引入打包输出的所有资源(js/css)
            template: "./src/index.html"
        })
    ],
    //  模式
    //mode: 'production',
    mode: "development",

    //开发服务器devServer:用来自动化(自动编译,自动打开浏览器,自动刷新浏览器~!).有一个特点:只会在内存中编译打包,不会对有任何的输出(就是不会编译成build文件夹输出)
    //启动devServer指令为:npx webpack-dev-server
    devServer: {
        contentBase: resolve(__dirname, "build"), //代表我要运行项目的目录,这里呢一般也是写一个绝对路径(目录是编译后的目录,不是源代码的目录)
        compress: true, //启动gzip压缩,从而我们的代码体积更小,运行更快
        open: true,
        port: 3000 //开发服务器的端口号
    }
};