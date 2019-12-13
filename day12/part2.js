const R = require('ramda');
const lcm = require( 'compute-lcm' );

const lineRegex = /<x=(-?\d+), y=(-?\d+), z=(-?\d+)>/;
const readLine = R.pipe(R.match(lineRegex), R.tail, R.map(parseInt));
const parseInput = R.pipe(R.trim, R.split('\n'), R.map(readLine));

const toKey = R.pipe(R.map(R.join(',')), R.join('/'));

const simulate = moons => {
    let loops = [];
    for(let i = 0; i < 3; i++) {
        let positions = new Set();

        let t = 0;
        while(true) {
            let key = toKey(moons);
            if (positions.has(key)) {
                loops.push(t - 1);
                break;
            }
            positions.add(key);
            t++;

            for(let [a, b] of R.xprod(moons, moons)) {
                let delta = Math.sign(b[i] - a[i]);
                if (delta !== 0)
                    a[i + 3] = (a[i + 3] || 0) + delta;
            }

            for(let moon of moons) {
                moon[i] += moon[i + 3];
            }
        }
    }

    return loops;
};

const solution = R.pipe(parseInput, simulate, lcm);

module.exports = solution;