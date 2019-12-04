const R = require('ramda');

const parseInput = R.pipe(R.trim, R.split('-'), R.map(parseInt));

const toString = x => `${x}`;
const eachDigit = R.pipe(toString, R.split(''), R.map(parseInt));
const neverDecreases = R.pipe(eachDigit, R.groupWith(R.lte), R.length, R.equals(1));
const twoAdjacentEqual = R.pipe(eachDigit, R.groupWith(R.equals), R.any(x => x.length === 2));

const solution = R.pipe(parseInput, R.apply(R.range), R.filter(neverDecreases), R.filter(twoAdjacentEqual), R.length);

module.exports = solution;