var R = require('ramda');

function* splitDigits(x)  {
    while (x) {
        yield x % 10;
        x = Math.floor(x / 10);
    }
}

module.exports = {
    splitDigits
}