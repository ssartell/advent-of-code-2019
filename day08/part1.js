const R = require('ramda');
const debug = x => { debugger; return x; };
const [width, height] = [25, 6];

const parseInput = R.pipe(R.trim, R.split(''), R.map(parseInt), R.splitEvery(width * height));
const count = x => R.pipe(R.filter(R.equals(x)), R.length);
const mostZeroes = R.pipe(R.sortBy(count(0)), R.head);

const solution = R.pipe(parseInput, mostZeroes, R.converge(R.multiply, [count(1), count(2)]));

module.exports = solution;