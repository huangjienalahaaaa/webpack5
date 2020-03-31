import count from './count';


/* 测试chunkFilename->第一种import方法:

    1.此时去掉webpack.config.js中的" chunkFilename: "[name]_chunk.js",然后运行webpack,就会发现:除了打包后的默认入口js->main.js,还有一个0.js文件(因为以id号命名),可以看到这种命名0.js方式很难看,所以要整改他->
        在webpack.config.js中加入" chunkFilename: "[name]_chunk.js"
    然后运行webpack,就会发现这个0.js就改为了0_chunk.js了.

    但是此时打包好的文件,没有加载到js目录下面,所以要加入到js目录下面,所以要改为:
    chunkFilename: "js/[name]_chunk.js"
*/
import('./add').then(({
    default: add //引入默认暴露的名字是default,现在重命名为add
}) => {
    console.log(add(1, 2))
});