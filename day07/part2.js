const R = require('ramda');
const debug = x => { debugger; return x; };

const parseInput = R.pipe(R.trim);

const solution = R.pipe(parseInput, debug);

module.exports = solution;