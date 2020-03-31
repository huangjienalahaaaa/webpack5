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
        publicPath: '/',

        /*chunkFilename:非入口chunk的文件名称:
            1.那么什么是入口chunk呢? 就是前面entry指定的文件( entry: "./src/js/index.js",)就叫做入口chunk
            2.那么怎么样才是非入口的chunk呢?->有2种:
                
         */
        chunkFilename: '[name]_chunk.js'
    },
    plugins: [
        new HtmlWebpackPlugin({})
    ],
    mode: "development"
};