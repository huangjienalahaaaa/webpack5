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