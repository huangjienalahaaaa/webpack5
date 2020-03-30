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


// 测试懒加载
console.log('index.js文件被懒加载了...');

// 以下代码如何进行懒加载 ? ? ? ? - > 这里就使用之前学习的语法 : import动态导入语法
// import {
//   add
// } from './test'
// document.getElementById('btn').onClick = function () {
//   console.log(add(4, 5));
// }


/*将上面的代码改为下面的,使用 import动态导入语法 ,实现懒加载~!:
  下面这个方法感觉是跟一般的语法没什么区别~!是的,只是下面的方法是将import放在一个异步的回调函数中,这样的话,一上来onClick.function(){}方法不会立刻调用,不会调用呢,那么我的js文件就并不会被加载.只有等我点击了按钮之后,才会触发这个回调函数,才会真正的去加载这个test.js文件
 */
document.getElementById('btn').onclick = function () {
  // import('./test').then(({
  import( /* webpackChunkName:'aaa'*/ './test').then(({ //当然也可以更改构建名称.因为懒加载的前提条件就是先进行代码分割,将这个要加载的页面分割成单独的chunk文件,然后对这个chunk文件进行懒加载
    add
  }) => {
    console.log(add(4, 5))
  });
}