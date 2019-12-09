const R = require('ramda');
const [width, height] = [25, 6];

const parseInput = R.pipe(R.trim, R.split(''), R.map(parseInt), R.splitEvery(width * height));
const applyPixel = (a, b) => b < 2 ? b : a;
const print = R.pipe(R.splitEvery(width), R.map(R.join('')), R.join('\n'), R.replace(/0/g, ' '), R.replace(/1/g, 'X'));

const solution = R.pipe(parseInput, R.reverse, R.reduce(R.zipWith(applyPixel), R.repeat(2, width * height)), print);

module.exports = solution;