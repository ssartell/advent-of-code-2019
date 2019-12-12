const R = require('ramda');
const debug = x => { debugger; return x; };

const lineRegex = /<x=(-?\d+), y=(-?\d+), z=(-?\d+)>/;
const readLine = R.pipe(R.match(lineRegex), R.tail, R.map(parseInt), R.zipObj(['x', 'y', 'z']));
const parseInput = R.pipe(R.trim, R.split('\n'), R.map(readLine));

const simulate = moons => {
    for(let i = 0; i < 1000; i++) {
        for(let [a, b] of R.xprod(moons, moons)) {
            let dx = Math.sign(b.x - a.x);
            if (dx !== 0) {
                a.dx = a.dx || 0 + dx;
            }

            let dy = Math.sign(b.y - a.y);
            if (dy !== 0) {
                a.dy += a.dy || 0 + dy;
            }

            let dz = Math.sign(b.z - a.z);
            if (dz !== 0) {
                a.dz += a.dz || 0 + dz;
            }
        }

        for(let moon of moons) {
            moon.x += moon.dx;
            moon.y += moon.dy;
            moon.z += moon.dz;
        }
    }

    return moons;
}

const solution = R.pipe(parseInput, debug);

module.exports = solution;