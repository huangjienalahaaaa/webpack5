/* 生产环境优化:
-----------第一节:-------------------
* oneOf:
    module/rules中的loader只会被处理一边.比如说项目中的css文件,当别cssloader处理完之后,就不需要再往下扫描其他的loader了.

    使用方法就是:module/urles中加oneOf:[],loader都放入oneOf:[]中.

    但是使用oneOf需要注意:不能有2项配置处理处理同一种类型文件.比如说下面的eslint-loader和babel-loader都是对js文件进行处理的,那么会出现一个问题:2个loader只会生效一个.那么怎么办呢?方法:我们需要把eslint-loader提取到oneOf之外即可,就ok了.->因为eslint-loader中有enforce:'pre',会优先执行.然后处理完之后,就会进入oneOf中,oneOf中只会匹配一个.

-----------第二节:-------------------
* 缓存(会从2个点出发,一个是对babel缓存,一个是对资源缓存):
    1. 对babel缓存(作用:让第二次打包构建速度更快):
        babel 缓存是什么意思呢? 就是我们在写代码的时候,我们永远都是js代码是最多的,像结构或者样式呢,要么少,要么很少,或者说要么不太多,而且即使多呢我们也没办法做更多的处理.那么为什么要对babel进行缓存呢,因为babel需要对我们写的js代码进行编译处理,编译一种我们浏览器能识别的语法,就是所谓的js的兼容性处理.比如说在编译过程中我们有100个js模块,但是我们只改动其中一个js模块,我们不可能把所有的模块再进行一次编译,其他的99个应该是不变的.这点呢跟我们之前的HRM功能一模一样:我们一个模块变,我们其他模块不变,而只变这一个模块.而在生产环境下呢我们又不能用HRM功能,因为HRM是基于devServer的,而生产环境是不需要devServer.而我们想做的事情就是:babel做这个翻译的时候,只有这个文件变,那么只需要这个文件变,其他文件是不变的.要想做到这一点,我们就要开启babel缓存:babel先对之前的100个文件编译后进行缓存处理,然后将来你再去编译的时候,发现文件没有变化,它就直接使用缓存了,而不会重新构建一次.

        怎么做呢?只需要在babel-loader中的options中,再加入一个参数 cacheDirectory: true 即可

    2.文件资源缓存(作用:让代码上线运行缓存更好使用):

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


-----------第三节:-------------------
* tree shaking(树摇):

    1.作用:去除应用程序中,没有使用到的代码,这样可以使代码体积更小

    2.前提:
        1. 必须使用ES6模块化(js文件必须使用es6语句)
        2. 开启production环境(这里已经让mode='production')

    3.测试: 在js下新建tree.js,然后在index.js中引入tree中的其中一个方法.然后webpack进行构建一次,在构建生成的js文件中,可以看到,只引入了mul方法,count方法没有引入

    4.这里有一个注意点:就是对于不同的版本,tree shaking可能会有一点点差异.这个差异就是tree shaking可能会将/src/js/index.js中引入的css代码给干掉.比方说我们可以模拟一下测试:在package.json中配置"sideEffects"选项->"sideEffects":false(意思就是:所有代码都是没有副作用的,既所有代码都可以进行tree shaking).
        这个时候我们再webpack构建一次,我们会发现,输出的资源就没有CSS了.也就是说,这么写,可能会将css或者@babel,polifill等等资文件源干掉,因为这些资源我们都是引入,但是没有直接使用,所以有可能会被干掉.所以我们要修改一下"sideEffects":false这个写法.比如说我们不要干掉css文件,那么就要改成"sideEffects":["*.css"].

-----------第四节:-------------------
* code splite(代码分割):
    1.作用:就是将我们打包生产的一个chunk,分割成多个文件.这样我们可以去实现各项功能.比如说,将一个大的文件分割成3个文件,那么我们加载的时候可以并行加载,从而速度更快.同时呢,分割成更多的文件,我们还可以"按需加载"的功能!!也就是我需要这个文件,我才加载这个文件,不需要用到就不加载.比如说我们开发的单页面应用的时候,我们整个页面是一个非常庞大的文件,那么我们肯定要按照路由去拆分一些文件,从而实现按需加载.那么如果你要拆分文件的话,你就可以使用webpack的这个技术,叫做代码分割:
        首先,你需要将每个路由文件都拆分成单独的js文件,这样呢才能实现按需加载

    2.方法:
        * 方法一.根据入口文件(下面的module.exports/entry:[])就可以进行配置(多入口,之前都是单入口)
            但是这里有一个问题,就是我们很难去指定多入口.比如说今天我们有2个入口,明天我们有3个入口.后天有4个...这样子改来改去就很麻烦,不太灵活.所以我们使用第二种配置方式
        * 方法二. 直接使用webpakc提供的配置,optization:{},如下面(但是src/js/index.js还是得用import来引用要引入的js文件)

        * 方法三.通过js代码,让某个文件单独打包成一个chunk:
            这个方法,看src/js/index.js

    3.一般情况下:都是
        1. 使用单入口配置+然后结合optization配置.能保证使得node_modules中的代码单独打包成一个chunk,然后将公共文件也单独打包成一个chunk
        2. 其次我希望其他的文件也要打包成单独的chunk,就使用第三种方法,通过js代码的方法.


-----------第五节:-------------------
* 懒加载和预加载:

    1.懒加载(指js的懒加载):就是触发了某个条件的时候才会加载,并不是一上来就会加载:
        这里看示例:在index.html中定义一个按钮,在index.js定义这个按钮的点击函数,引入test.js.此时使用webpack命令打包,然后运行打包后的文件,在localhost:3000页面中可以看出这个时候还没有点击按钮,但是已经加载了test.js文件.请看index.js中这块部分!!
    2.预加载:请看index.js 测试懒加载部分,这里直接在懒加载后面说了预加载
-----------第六节:-------------------
* PWA(也叫作:渐进式网络开发应用技术):
    1.作用:帮助我们将网页像APP程序一样,离线也可以访问,性能也更好.
    2.那么PWA使用量多不多呢?因为兼容性问题,那么PWA普及开来,还是需要一定的时间.虽然早就发明了,但是目前还是有很多大厂在使用,比如说淘宝:进入淘宝页面,将network调为'offline',然后刷新页面,你会发现这个网页大部分内容是可以正常使用

    3.那么如何使用PWA技术呢? 通过'workbox'来实现,当然在webapck中,是通过'workbox-webpack-plugin'插件来实现的.
    4.接下去如何去使用请看视频,因为平时我没用到.
-----------第七节:-------------------
* 多进程打包:

    1.首先下载thread-loader :npm  i thread-loader -D
    2.接下去,哪个东西要进行多进程呢,就把thread-loader放过去.就可以启动多进程了.一般我们是给babel-loder用的,而使用多个loader,就得在配置中使用use:[]数组,所以看下面babel-loader中的相关配置.


    3.注意:使用这个thread-loader多进程打包的话,是有利有弊的:你用好了,这个速度就杠杠提升;如果你没用好,那么速度就会非常慢,为什么呢?因为进程开启是需要时间的,启动时间大概为600ms.而且进程通信(比如说我要同时只干一件事情,我要干完了,我要告诉你这个事情我干完了,你再接着干什么什么东西)也有开销,需要花时间.所以,假设:一件事情只需要100ms,你却启用多进程,而多进程开启都需要600ms,有点得不偿失.所以只有这个工作需要长时间去使用,才需要多进程打包.->js中呢有一个eslint-loader,还有一个babel-loader.eslint只做语法检查:你要么错,要么不错.而babel-loader:需要编译啊,转换啊,所以消耗时间比较长,也是我们工作时间最长的一个loader.当然我们这个文件中,不加thread-loader比加了thread-loader webpack要打包的快,因为这里js文件很少.

    4.当thread-loader一启动呢.会根据cpu盒数-1这样一个数量去启动进程.当然你也可以调整,如下面(得将hread-loader改成对象).
-----------第八节:-------------------
* externals:
    1.作用:防止将我们的某些包打包到我们最终输出的bundle中:比如说我们这里的jquery,我们希望jquery是通过CDN链接给引用进来,这个时候我们就用externals将其禁止掉,也就是让其不会被打包,那么我们从CDN链接中去使用jquery.

    2.使用方法:在webpack配置中,使用externals对象配置,如下面.

    3.externals使用场景:将来要是有些包要使用CDN的方式,就在下面的externals配置中将这个包给拒绝打包掉,然后在index.html中手动将这个CDN链接加进来.

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
            plugins: () => [require("postcss-preset-env")()]
        }
    }
];

module.exports = {
    entry: ["./src/js/index.js"], //单入口
    // entry: { //code splite按需加载方法一.多入口.因为是多入口了,所以要将之前的单入口时候,src/js/index.js中引入tree.js 这句话删去,不需要引入了.此时webpack打包,因为下面output:{ filename: "js/build.[contenthash:10].js"}输出的名字不好区别,所以我们将output中的filename的值改成js/[name].[contenthash:10].js.[name]会取文件名.比如说这里的index.js打包后[name]=main.print.js打包后,[name]=tree
    //     main: "./src/js/index.js",
    //     tree: "./src/js/print.js"
    // },
    output: {
        // filename: 'js/build.[hash:10].js', //资源缓存解决:文件名加入hash值
        // filename: 'js/build.[chunkhash:10].js', //利用chunkhash值
        // filename: "js/build.[contenthash:10].js", //利用contenthash值
        filename: "js/[name].[contenthash:10].js", //[name]会取文件名
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
            oneOf: [
                //以下loader只会匹配一个
                {
                    test: /\.css$/,
                    use: [...commonCssLoader]
                },
                {
                    test: /\.less$/,
                    use: [...commonCssLoader, "less-loader"]
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
                    use: [
                        // 'thread-loader', //开启多进程打包
                        { //调整thread-loader
                            loader: 'thread-loader',
                            options: { //配置
                                workers: 2 //进程数为2个
                            }
                        },
                        {
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
                    ],

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


    /*css splite方法二:
      optization:
      1.如果在src/js/index.js中引入jquery:import $ from 'jquery',那么webpack打包后,可以将node_modules中的代码,单独打包成一个chunk,最终输出.而上面的entry:'./src/js/index.js'我们也会将这个单入口文件打包成一个chunk
      2.如果上面的上面的entry是多入口的话,那么也就会分别生成对应入口的chunk.但是在多入口文件print.js中也引入jquery:import $ from 'jquery',此时再进行打包,会发现,这2个多入口文件打包口的chunk共用node-modules打包后的jquery代码->也就是说:optization会自动分析多入口chunk中,有没有公共的文件.如果有,会将其打包成一个chunk.
      
      * 从上面的第二条可以看出,css splite并不是说只能选择方法1或者方法2,是要根据你的需求进行灵活选择,比如说用方法二,搭配单入口.或者是用方法二,搭配多入口.

    *我们将来开发的时候,还是单页面应用比较多,多入口的话还是少一点的.但是如果我们使用单入口的话,只能做上面的第一件事情,就是只能单独打包node_modules为一个chunk,但是第二件事情就做不了了,既不能提取公共的文件.这时候该怎么办??通过第三种方式.
    */
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },

    mode: "production", //这里应该要改为production了
    externals: { //externals选项
        //拒绝jQuery被打包进来,记得在index.html中将jqury的CDN链接给引用进来(使用BootCDN:因为是免费的),然后webpack进行打包.然后运行,发现index.js这块相应测试代码是可以完成的
        jquery: 'jQuery' //忽略的库名:npm下载的包名
    },

    devServer: {
        contentBase: resolve(__dirname, "build"),
        compress: true,
        open: true,
        port: 3000,
        hot: true
    },
    devtool: "source-map"
};