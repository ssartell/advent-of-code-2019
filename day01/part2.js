const R = require('ramda');

const parseInput = R.pipe(R.trim, R.split('\n'), R.map(parseInt));
const moduleFuel = x => Math.floor(x / 3) - 2;
const sum = R.reduce(R.add, 0);

const calcFuel = module => {
    const fuel = moduleFuel(module);
    return fuel > 0 ? fuel + calcFuel(fuel) : 0;
}

const solution = R.pipe(parseInput, R.map(calcFuel), sum);

module.exports = solution;