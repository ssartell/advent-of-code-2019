const R = require('ramda');

const parseInput = R.pipe(R.trim, R.split('-'), R.map(parseInt));

const eachDigit = R.pipe(R.toString, R.split(''), R.map(parseInt));
const neverDecreases = R.pipe(R.groupWith(R.lte), R.length, R.equals(1));
const twoAdjacentEqual = R.pipe(R.groupWith(R.equals), x => x.length < 6);

const solution = R.pipe(parseInput, R.apply(R.range), R.map(eachDigit), R.filter(neverDecreases), R.filter(twoAdjacentEqual), R.length);

module.exports = solution;