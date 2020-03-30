//测试树摇,只引入其中一个方法
import { mul } from "./tree";

import "../css/index.css";

function sum(...args) {
  return args.reduce((p, c) => p + c, 0);
}
console.log(sum(1, 2, 3, 4));

//测试树摇
console.log(mul(1, 2));
