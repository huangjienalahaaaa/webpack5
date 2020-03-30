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

    2.文件资源缓存:

        * 方法1:hash值:
        
        原理:利用每次webpack构建时,都会生成一个唯一的hash值

        如何缓存呢?首先,我们需要写一个服务器的代码,在根目录下新建server.js(使用express来搭建Nodejs服务器),在这个文件中我们暴露buuld文件夹.此时nodemon server.js启动服务器后,地址栏输入localhost:3000,打开开发者模式,在Network中,随意点击一个build下的文件,比如build.cd文件,此时Headers->Response Headers->Cache-Control:public,max-age=3600.就可以看到,这个资源被强制缓存1个小时.
        但是这个缓存会带来新的问题:比如我们这个代码需要改变,比如src/index.js文件中的代码改变了,然后我们在终端输入webpack再构建一次,然后刷新localhost:3000页面,会发现页面没有变化.!!!!这是为什么呢?因为这些资源在缓存期间,是不会访问服务器的,他是直接读取本地的缓存,就会带来一个问题:比如我们的资源,在上线的时候出现了一个严重的bug,我们开发者需要紧急的修复它,但因它被强制的缓存,我们被办法进行修复,这个时候该怎么办呢?
            这个时候我们提出:给资源名称做一个手脚.给资源名称一个版本号,下次更新的时候,更改这个版本号,这个资源名称变了,那么这个资源就得重新请求.这里呢,我们加上一个hash值: 
                * 如何做? 
                    1.对js文件:在下面的 output中的filename中,将js/build.js加入hash值:js/build.[hash:10].js  (这个hash值取得就是webpack构建时生成的hash值的前10位)
                    2.对css样式文件:也是加入hash值.如上.在plugins中的new MiniCssExtractPlugin中的filename改为'css/build.[hash:10].css'(这个hash值取得就是webpack构建时生成的hash值的前10位)
        
        但是这种使用hash值的方法会有一个问题:比如我们现在只更改src/js/index.js文件,而不更改src/css/index.css文件.然后运行webpack打包,因为js和css的hash值都是对应webpack的每次打包的hash值,所以这里css文件和js文件一旦有一个文件变化,这2个文件是一起变化的.所以,webpack引入了另外一个hash值,叫做chunkhash值.

        * 方法2:chunkhash值:
            原理:根据chunk生成的hash值:如果打包来源于同一个chunk,那么hash值就一样
            
            * 方法:就是将 js/css中的[hash:10]改为[chunkhash:10]即可!
            
            然后运行webpack打包,然后会发现一个问题:js和css的hash值还是一样的.为什么呢?因为css是在js中被引进来的.所以同属于一个chunk.
            
            什么是chunk??? 比如说咋们的入口文件./src/js/index.js,它会引入其他的依赖,比如css文件,js文件等等.这些文件会最终跟这个入口文件形成一个文件,这个生产的文件呢我们就叫他chunk(所有根据入口文件一起引入的文件都是同一个chunk)

            所以我们又引入了第三种hash办法,contenthash

        * 方法3:contenthash值(根据文件的内容生成hash值.所以不同文件hash值一定不一样)

         * 方法:就是将 js/css中的[hash:10]改为[contenthash值:10]即可!

 */
const {
    resolve
} = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");


process.env.NODE_ENV = "production"; //这里应该要改为production了


const commonCssLoader = [
    MiniCssExtractPlugin.loader,
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
        // filename: 'js/build.[hash:10].js', //资源缓存解决:文件名加入hash值
        // filename: 'js/build.[chunkhash:10].js', //利用chunkhash值
        filename: 'js/build.[contenthash:10].js', //利用contenthash值
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
            // filename: "css/build.[hash:10].css" //资源缓存解决:文件名加入hash值
            // filename: "css/build.[chunkhash:10].css" //利用chunkhash值
            filename: "css/build.[contenthash:10].css" //利用contenthash值
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
    devtool: 'source-map'
};