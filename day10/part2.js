const R = require('ramda');
const station = { x: 13, y: 17 };

function* eachAsteroid(map) {
    for(let y = 0; y < map.length; y++)
        for(let x = 0; x < map[0].length; x++)
            if (map[y][x] === '#' && (x !== station.x || y !== station.y))
                yield { x, y };
}

const parseInput = R.pipe(R.trim, R.split('\r\n'), R.map(R.split('')));
const angle = a => Math.atan2(station.y - a.y, a.x - station.x);

const getDetails = asteroids => asteroids
    .map(a => ({
        x: a.x,
        y: a.y,
        angle: (Math.PI / 2 - angle(a) + 2 * Math.PI) % (2 * Math.PI),
        dist: Math.abs(a.x - station.x) + Math.abs(a.y - station.y)
    }));

const inLaserOrder = R.pipe(R.sortWith([R.ascend(R.prop('angle')), R.ascend(R.prop('dist'))]), R.groupWith((a, b) => a.angle === b.angle), R.transpose, R.flatten);
const solution = R.pipe(parseInput, eachAsteroid, Array.from, getDetails, inLaserOrder, a => a[199].x * 100 + a[199].y);

module.exports = solution;