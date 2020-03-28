import '../css/index.css';

function add(x, y) {
  return x + y;
}

// eslint-disable-next-line
console.log(add(1, 2));


const aa = (x, y) => x + y;

// eslint-disable-next-line
console.log(aa(1, 2));

const promise = new Promise((resolve) => {
  setTimeout(() => {
    console.log('定时器ok了');
    resolve();
  }, 1000);
});

// eslint-disable-next-line
console.log(promise);
console.log('********');


// js的HRM功能
if (module.hot) { //如果module.hot=true,说明开启了HRM功能,此时我们要做的事情就是:让HRM功能代码生效
  module.hot.accept('./print.js', function () { //意思是 这个方法会坚挺print.js文件的变化,一旦发生变化,其他模块不会打包构建,只会执行后面这个回调函数

  })
}