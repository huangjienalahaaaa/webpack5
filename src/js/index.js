//测试树摇,只引入其中一个方法
// import {
//   mul
// } from "./tree";



/*测试css splite方法三:通过js代码,让某个文件被单独打包成一个chunk:执行webpack命令后,会发现,index.js以及print.js都会被单独打包.index.js被打包成main.XXXX.js,print.js被打包成1.XXXX.js 

  * 也就是说这种方法是import动态导入语法:能将某个文件单独打包.
  
  然后,你看打包后的名字1.XXXX.js以及main.XXXX.js并不友好,这个名字是根据打包后的id来命名的.那怎么办呢?将下面的import('./print')加入一个参数,改成:import(\/* webpackChunkName:'名字'*\/
'./print')
*/
// import('./print').then(({ //默认使用id来命名
import( /* webpackChunkName:'test'*/ './print').then(({ //传入打包后的名字,这里是意思是:打包后的名字就叫test
  mul,
  count
}) => {
  console.log('文件加载成功')
  console.log(mul)
  console.log(count)
}).catch(() => {
  console.log('文件加载失败')
})

import "../css/index.css";

function sum(...args) {
  return args.reduce((p, c) => p + c, 0);
}
console.log(sum(1, 2, 3, 4));

//测试树摇
// console.log(mul(1, 2));