const R = require('ramda');
const [w, h] = [25, 6];

const parseInput = R.pipe(R.trim, R.split(''), R.splitEvery(w * h));
const applyPixel = (a, b) => b !== '2' ? b : a;
const print = R.pipe(R.join(''), R.splitEvery(w), R.join('\n'), R.replace(/0/g, ' '), R.replace(/1/g, 'X'));

const solution = R.pipe(parseInput, R.reverse, R.reduce(R.zipWith(applyPixel), new Array(w * h)), print);

module.exports = solution;