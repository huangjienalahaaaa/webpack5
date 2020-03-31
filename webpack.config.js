/* webpack配置详解
----------第一节------------
可以去webpack中文官网(因为对着文档开发,能接触到最新的东西)->文档->配置中看(https://www.webpackjs.com/configuration/)

----------第二节------------
webpack详细配置之entry(入口文件):

* 1.string:

    1.形式:  "./src/js/index.js"

    2.特点:  所有文件全都打包生成一个chunk,输出一个bundle文件.此时chunk的默认名称叫做main.js(除非在output/filename设定输出名称)

* 2.array:

    1.形式:  ["./src/js/index.js", "./src/js/add.js"]

    2.特点:  多入口,所有入口文件最终只会生成一个chunk文件,输出一个bundle文件.此时chunk的默认名称叫做main.js(如这个实例中,是将index.js和add.js打包成一个chunk,名字叫做main.js)

    3.作用: 这种形式只有一种用法.就是之前做HRM功能的时候,html内容修改后不能热更新了,所以使用这种方法.

* 3.object:

    1.形式( key - value ):  
            {
                index: "./src/js/index.js",
                add: "./src/js/add.js"
            },

    2.特点: 多入口,有几个文件就形成几个chunk,输出几个bundle文件.此时chunk的名称就是key值.


* 通常情况下,我们第一种和第三种用的比较多,第二种是特殊情况下才会使用到的.

4.特殊用法: 
     1.形式( key - value ):  
        { 
            index: ["./src/js/index.js", "./src/js/count.js"], //这里是数组
            add: "./src/js/add.js"
        }

    2.特点: 对于数组里的这2个文件,跟第二点是相同的,如这个实例中,是将index.js和count.js打包成一个chunk,名字叫做index.js,而add.js会单独打包,名字叫做add.js
    3.这个用法我们在哪里看过呢?在之前的dill时候的webpack.dill.js文件里面:
        entry{
            jquery:['jquery'], //这里
            // react:['react','react-dom','react-router-dom'] //所以以后我们可以使用这种方式,来打包react全家桶到同一个文件中
        }
 */
const {
    resolve
} = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    // entry: "./src/js/index.js", //1.string类型
    // entry: ["./src/js/index.js", "./src/js/add.js"], //2.array类型
    // entry: { //3.object类型
    //     index: "./src/js/index.js",
    //     add: "./src/js/add.js"
    // },
    entry: { //4.特熟用法
        index: ["./src/js/index.js", "./src/js/count.js"], //这里是数组
        add: "./src/js/add.js"
    },
    output: {
        filename: "[name].js", //使用默认名称
        path: resolve(__dirname, "build")
    },
    plugins: [
        new HtmlWebpackPlugin({})
    ],
    mode: "development"
};