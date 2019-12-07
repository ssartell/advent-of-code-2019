const R = require('ramda');

const parseLine = R.pipe(R.split(')'), R.zipObj(['object', 'satellite']));
const parseInput = R.pipe(R.trim, R.split('\r\n'), R.map(parseLine));

const toMap = R.reduce((map, { object, satellite }) => map.set(object, R.append(satellite, map.get(object) || [])));
const sum = R.reduce(R.add, 0);

const countOrbits = R.curry((object, depth, map) => {
    let satellites = map.get(object) || [];
    return depth + sum(R.map(x => countOrbits(x, depth + 1, map), satellites));
});

const solution = R.pipe(parseInput, x => toMap(new Map(), x), countOrbits('COM', 0));

module.exports = solution;