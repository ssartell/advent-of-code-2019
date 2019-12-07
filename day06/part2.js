const R = require('ramda');

const parseLine = R.pipe(R.split(')'), R.zipObj(['object', 'satellite']));
const parseInput = R.pipe(R.trim, R.split('\r\n'), R.map(parseLine));

const toMap = R.reduce((map, { object, satellite }) => map.set(object, R.append(satellite, map.get(object) || [])));
const sum = R.reduce(R.add, 0);

const countTransfers = R.curry((object, depth, map) => {
    let satellites = map.get(object) || [];
    let transfers = R.filter(x => x !== 0, R.map(x => countTransfers(x, depth + 1, map), satellites));
    if (object === 'YOU' || object === 'SAN') {
        return transfers.length === 1 ? R.head(transfers) - depth : depth - 1;
    } else if (transfers.length === 2) {
        return sum(transfers) - depth * 2;
    } else if (transfers.length === 1) {
        return transfers[0];
    } else {
        return 0;
    }
});

const solution = R.pipe(parseInput, x => toMap(new Map(), x), countTransfers('COM', 0));

module.exports = solution;