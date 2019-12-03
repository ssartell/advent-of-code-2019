const R = require('ramda');

const stepRegex = /(\w)(\d+)/;
const parseStep = R.pipe(R.match(stepRegex), R.tail, R.zipObj(['dir', 'length']), R.evolve({ 'length': parseInt }));
const parseLine = R.pipe(R.split(','), R.map(parseStep));
const parseInput = R.pipe(R.trim, R.split('\n'), R.map(parseLine));

const dirs = {
    U: { x: 0, y: -1 },
    D: { x: 0, y: 1 },
    L: { x: -1, y: 0 },
    R: { x: 1, y: 0 }
};

const extendWire = wireSteps => {
    let wire = new Map();
    let pos = { x: 0, y: 0 };
    let steps = 0;
    
    for(let step of wireSteps) {
        let dir = dirs[step.dir];
        for(let i = 0; i < step.length; i++) {
            pos.x += dir.x;
            pos.y += dir.y;
            wire.set(`${pos.x},${pos.y}`, ++steps);
        }
    }

    return wire;
}

const nearestIntersection = wires => {
    let [wire1, wire2] = wires;
    let shortestDist = Infinity;

    for(let pos of wire1.keys()) {
        if (wire2.has(pos)) {
            let dist = wire1.get(pos) + wire2.get(pos);
            shortestDist = Math.min(shortestDist, dist);
        }
    }

    return shortestDist;
}

const solution = R.pipe(parseInput, R.map(extendWire), nearestIntersection);

module.exports = solution;