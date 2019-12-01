const R = require('ramda');

const parseInput = R.pipe(R.trim, R.split('\n'), R.map(parseInt));
const moduleFuel = x => R.max(0, Math.floor(x / 3) - 2);
const modulesFuel = R.map(moduleFuel);
const sum = R.reduce(R.add, 0);

const sumFuel = modules => {
    const fuel = modulesFuel(modules);
    const total = sum(fuel);

    if (total <= 0) return total;
    return total + sumFuel(fuel);
}

const solution = R.pipe(parseInput, sumFuel);

module.exports = solution;