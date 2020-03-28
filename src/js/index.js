/**
 ---------------第一节---------

 */
import '../css/index.css';

function add(x, y) {
  return x + y;
}
// eslint报了一个warning错误,因为eslint不想要打包的时候使用console.log.所以我们可以使用下面这个eslint-diable-next-line,这个表示"下一行eslint所有规则都失效(下一行不进行eslint检查)"

// eslint-disable-next-line
console.log(add(1, 2));

// 检验js兼容性
const add2 = (x, y) => {
  return x + y;
};
console.log(add2(1, 2))