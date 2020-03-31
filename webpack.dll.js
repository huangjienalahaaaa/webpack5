/*
    1. 使用dll技术,对某些库(指第三方库:如jquery,vue,react...)进行单独打包.我们这里使用jquery为例
    2. 当你运行webpack时,默认查找的是webpack.config.js这个配置文件.而我们现在的需求是:需要运行webpack.dll.js文件:
        所以我们运行指令要改,改成:webpack --config webpack.dll.js.
    3.来,让我们现在运行这条指令.会发现生成了dll文件夹,里面有jquery.js和manifest.json这2个文件.现在我们使用dll运行完之后,将来jquery我们就不需要再打包了,因为我们已经打包过了,将来我们的源代码只需要引入jquery,直接用就行了.怎么做呢?接下来继续回到webapck.config.js中去配置.

*/
const {
    resolve
} = require('path');


//因为下面要用到webpack自带的一个插件DllPlugin(作用:建立依赖关系,告诉webpack:将来打包的时候不需要打包jquery了),所以这里直接引入webpack
const webpack = require('webpack');

module.exports = {
    entry: {
        jquery: ['jquery'] //1. 前面这个jquery表示:打包生成的name叫做jquery. 2.后面这个jquery表示:要打包的这个库叫做jquery.因为这里是数组,那么将来与jquery类似的库,都可以放入这个数组里面,都可以进行打包
    },
    output: {
        filename: '[name].js', //[name]就是上面entry中中前面那个jquery,
        path: resolve(__dirname, 'dll'),
        library: '[name]_[hash]', //表示:我们打包的库,里面向外暴露出去的内容叫什么名字
    },
    plugins: [
        new webpack.DllPlugin({ //这个插件的是帮助我们生成一个manifest.json文件,这个文件呢,提供和jquery的映射关系,那么将来通过映射我们就知道,jquery这个库呢,原来不需要打包
            name: '[name]_[hash]', //映射库的暴露的内容名称,跟上面的output中的library一致,这样才能建立关系.
            path: resolve(__dirname, 'dll/manifest.json')
        })
    ],
    mode: 'production'
}