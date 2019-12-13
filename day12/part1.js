const R = require('ramda');

const lineRegex = /<x=(-?\d+), y=(-?\d+), z=(-?\d+)>/;
const readLine = R.pipe(R.match(lineRegex), R.tail, R.map(parseInt));
const parseInput = R.pipe(R.trim, R.split('\n'), R.map(readLine));

const simulate = moons => {
    for(let t = 0; t < 1000; t++) {
        for(let [a, b] of R.xprod(moons, moons)) {
            for(let i = 0; i < 3; i++) {
                let delta = Math.sign(b[i] - a[i]);
                if (delta !== 0)
                    a[i + 3] = (a[i + 3] || 0) + delta;
            }
        }

        for(let moon of moons) {
            for(let i = 0; i < 3; i++) {
                moon[i] += moon[i + 3];
            }
        }
    }
    return moons;
};

const energy = R.pipe(R.map(Math.abs), R.sum);
const potential = R.pipe(R.take(3), energy);
const kinetic = R.pipe(R.drop(3), energy);

const totalEnergy = R.pipe(R.map(R.converge(R.multiply, [potential, kinetic])), R.sum);

const solution = R.pipe(parseInput, simulate, totalEnergy);

module.exports = solution;