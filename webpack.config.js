/* webpack配置详解
----------第一节------------
webpack详细配置之output:

 */
const {
    resolve
} = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/js/index.js",

    output: {
        //文件名称(指定目录名称/名称)
        filename: "js/[name].js",
        //输出文件目录路径(将来所有资源输出的公共目录.所以将来不管是css,图片等,都会输出到这个路径下面,具体是在这个路径的哪里,就看你对这个输出资源有没有进行额外的配置)
        path: resolve(__dirname, "build"),

        /*
            
            1. publicPath一般用于生产环境.所有资源引入公共路径的前缀(比如说将来我们有一个图片路径('imgs/a.jpg'),那么经过这个公共路径的处理,就会变为/imgs/a.jpg.如果你会一些服务器支持的话你就会知道:'/imgs/a.jpg'这样的方式,意思是"以当前的服务器地址去补充:去服务器的根目录下去找imgs文件夹,然后去找a.jpg.代码上线的时候我们更倾向与这种方式);而'imgs/a.jpg'这样的方式,意思是"当前路径下直接去找imgs文件夹,然后去找a.jpg".

            2. 这种方式测试:
            注释掉 下面的publicPath: '/'这句话,打包后,在html文件中:
                <script src="js/main.js"></script> 
                scr是以第二种方式引入文件的.
            然后去掉注释之后,打包,发现:
                <script src="/js/main.js"></script>
                 scr是以第一种方式引入文件的.
            */
        publicPath: "/",

        /*chunkFilename:非入口chunk的文件名称:
                1.那么什么是入口chunk呢? 就是前面entry指定的文件( entry: "./src/js/index.js",)就叫做入口chunk
                2.那么怎么样才是非入口的chunk呢?->有2种:

                    1.通过import语法,它会将文件单独分割成一个chunk
                    2.optimize(??拼读不一定正确),将Node_modules中的东西分割成单独的chunk

                我们以第一种为例来测试->看index.js中对应的测试代码.

                    
             */
        // chunkFilename: "[name]_chunk.js"
        chunkFilename: "js/[name]_chunk.js", //输出到js目录下
        /*
            1.library有什么用呢?
                将下面的  library: '[name]' 给注释掉,然后webpack打包,然后看打包后的main.js,可以看到:
                    main中的代码,整个外面包了一层函数,源代码中的调用(import add form ./add),是将其作为参数给传进去.所以可知:这些所以内容都是在函数作用于下,外面想要引用是不可能的那么我想将里面的内容暴露出去给外面的人使用的话呢,就使用library:
             将下面的  library: '[name]' 的注释给删了,,然后webpack打包,然后看打包后的main.js,可以看到:
                因为这个文件的名字叫做main,所以可以看到main.js有个全局暴露变量name,叫做main(因为下面定义名字为[name]):
                    var main=...

             2. 这个暴露的全局变量main还可以通过LibraryTarget来指定.比如说下面的:
              libraryTarget: 'window'
              那么这个全局变量就会添加到window下面,而不是简单的var定义:
                window["main"] = ...
                所以这种方案适用于浏览器端

            3.library一般是作为暴露整个库去使用,它通常是结合dill加某个库去单独打包,然后我们引入使用,这个时候我们才使用library.如果正常打包的话,library一般是不需要的

        */
        library: '[name]', //整个库向外暴露的变量名
        // libraryTarget: 'window' // 指:将变量名添加到哪个上,这里是browser
        // libraryTarget: 'global' // 指:将变量名添加到哪个上,这里是nodejs服务端
        ibraryTarget: 'commonjs' // 可以值为commonjs,那么打包后的main.js整体会通过commonjs方法来暴露: exports["main"] ... 当然还能用amd等规则来,这里就不继续测试下去了

    },
    plugins: [new HtmlWebpackPlugin({})],
    mode: "development"
};