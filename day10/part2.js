const R = require('ramda');
const station = { x: 13, y: 17 };

const parseInput = R.pipe(R.trim, R.split('\r\n'), R.map(R.split('')));

function* eachAsteroid(map) {
    for(let y = 0; y < map.length; y++)
        for(let x = 0; x < map[0].length; x++)
            if (map[y][x] === '#' && (x !== station.x || y !== station.y))
                yield { x, y };
}

const angle = a => (Math.PI / 2 - Math.atan2(station.y - a.y, a.x - station.x) + 2 * Math.PI) % (2 * Math.PI);
const sameAngle = (a, b) => a.angle === b.angle;
const manhattan = a => Math.abs(a.x - station.x) + Math.abs(a.y - station.y);
const withAngleAndDist = R.map(a => ({ x: a.x, y: a.y, angle: angle(a), dist: manhattan(a) }));

const inLaserOrder = R.pipe(R.sortBy(x => x.dist), R.sortBy(x => x.angle), R.groupWith(sameAngle), R.transpose, R.flatten);
const calcAnswer = a => a[199].x * 100 + a[199].y;

const solution = R.pipe(parseInput, eachAsteroid, Array.from, withAngleAndDist, inLaserOrder, calcAnswer);

module.exports = solution;