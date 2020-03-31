/* webpack配置详解
----------第一节------------
webpack配置详解-resolve:

    1.resoleve:是用来->解析模块的规则

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
    // 解析模块规则
    resolve: {

        alias: { //起别名->优点:可以简写路径.缺点:用这个方式写路径的时候,没有提示
            $css: resolve(__dirname, 'src/css') //实例看:js/index.js中引入css文件
        },


        extensions: [ //配置省略文件路径的后缀名,默认是['.js','json'],所以我们在写js路径名的时候,可以省略不写这个后缀,现在比如说想要将引入的css文件,省略其后缀名,可以不写,就可以下面这么写.实例看:js/index.js中引入css文件
            '.js', '.json', '.css'
        ],


        modules: [ //告诉webpack,解析模块的时候,应该去哪个目录去找.默认是去Node_modules中找,它会怎么去找呢?->它会先去当前目录去找有没有node_modules，没有呢就去上一层目录下去找，没有呢再去上一层，一直这么找下去．．．所以这样太麻烦了，所以我们可以通过绝对路径的方式，告诉他这个目录是在哪里，不需要这么一层层去找了，这样子解析速度会快一些，如下面：
            resolve(__dirname, './node_modules')

        ]

    }
};