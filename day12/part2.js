const R = require('ramda');
const debug = x => { debugger; return x; };

const lineRegex = /<x=(-?\d+), y=(-?\d+), z=(-?\d+)>/;
const readLine = R.pipe(R.match(lineRegex), R.tail, R.map(parseInt));
const parseInput = R.pipe(R.trim, R.split('\n'), R.map(readLine));

const toKey = R.pipe(R.map(R.pipe(R.join(','))), R.join('/'));

const simulate = moons => {
    let positions = new Set();

    let t = 0;
    while(true) {
        let key = toKey(moons);
        if (positions.has(key)) 
            return t - 1;
        positions.add(key);
        t++;

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
};

const solution = R.pipe(parseInput, simulate);

module.exports = solution;