/**
 ---------------第一节---------
 *index.js :webpack的入口文件

 1. 运行指令:

     *  开发环境:webpack  ./src/index.js  -o ./build/build.js  --mode=development
        webpack会以 ./src/index.js为入口文件开始打包,打包后输出到 ./build/build.js
        整体打包环境,是开发环境

    *  生产环境:webpack ./src/index.js  -o ./build/build.js  --mode=production
        webpack会以 ./src/index.js为入口文件开始打包,打包后输出到 ./build/build.js
          整体打包环境,是生产环境
    2.结论:
        * webpack能处理js/json资源,不能处理css/img等其他资源
        *  生产环境和开发环境是 es6模块化编译成浏览器能识别的模块
        * 生产环境比开发环境多一个压缩js代码的功能

 */
import "./index.less";

function add(x, y) {
  return x + y;
}
console.log(add(1, 2));