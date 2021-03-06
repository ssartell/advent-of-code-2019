const R = require('ramda');

function* eachAsteroid(map) {
    for(let y = 0; y < map.length; y++)
        for(let x = 0; x < map[0].length; x++)
            if (map[y][x] === '#')
                yield { x, y };
}

const parseInput = R.pipe(R.trim, R.split('\r\n'), R.map(R.split('')));
const angle = (a, b) => Math.atan2(b.y - a.y, b.x - a.x);
const uniqueAngles = asteroids => asteroids.map(a => R.length(R.uniq(asteroids.filter(b => !R.whereEq(a,b)).map(b => angle(a, b)))));

const solution = R.pipe(parseInput, eachAsteroid, Array.from, uniqueAngles, R.sortBy(x => x), R.last);

module.exports = solution;