const express = require('express');

const app = express();

app.use(express.static('build', {
   maxAge: 1000 * 3600
}))
console.log('biubiu123')

app.listen(3000);