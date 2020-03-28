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
import "../css/index.css";

// 检验js兼容性
// import "@babel/polyfill";

function add(x, y) {
  return x + y;
}
// eslint报了一个warning错误,因为eslint不想要打包的时候使用console.log.所以我们可以使用下面这个eslint-diable-next-line,这个表示"下一行eslint所有规则都失效(下一行不进行eslint检查)"

// eslint-disable-next-line
console.log(add(1, 2));

// １．检验js兼容性 -> @babel/preset-env部分
const aa = (x, y) => {
  return x + y;
};
console.log(aa(1, 2));

// ２．检验js兼容性 -> @babel/polyfill部分/core-js按需加载
const promise = new Promise(resolve => {
  setTimeout(() => {
    console.log("定时器ok了");
    resolve();
  }, 1000);
});
console.log(promise);
