const R = require('ramda');
const compile = require('./intcodeComputer');
const debug = x => { debugger; return x; };

const runRobot = prog => {
    let dir = { x: 0, y: 1 };
    let pos = { x: 0, y: 0 };
    let panels = new Map();

    let getKey = pos => `${pos.x},${pos.y}`;
    let getColor = pos => panels.get(getKey(pos)) || 0;
    let setColor = (pos, color) => panels.set(getKey(pos), color);

    let turnLeft = dir => ({ x: -dir.y, y: dir.x });
    let turnRight = dir => ({ x: dir.y, y: -dir.x });

    setColor(pos, 1);

    while(!prog.isHalted()) {
        prog.giveInput(getColor(pos));
        prog.run()
        if (prog.isHalted()) break;
        setColor(pos, prog.getOutput());
        prog.run();
        if (prog.isHalted()) break;
        dir = prog.getOutput() === 0 ? turnLeft(dir) : turnRight(dir);
        pos = { x: pos.x + dir.x, y: pos.y + dir.y };
    }
    return panels;
}

const keysToCoords = R.pipe(Array.from, R.map(R.pipe(R.split(','), R.map(parseInt))));
const min = R.reduce(R.min, Infinity);
const max = R.reduce(R.max, -Infinity);
const getRange = R.converge(R.pair, [min, max]);

const drawShip = panels => {
    let coords = keysToCoords(panels.keys());
    let xRange = getRange(coords.map(R.head));
    let yRange = getRange(coords.map(R.last));

    for(let y = yRange[1]; y >= yRange[0]; y--) {
        let line = '';
        for(let x = xRange[0]; x <= xRange[1]; x++) {
            let key = `${x},${y}`;
            line += panels.has(key) && panels.get(`${x},${y}`) === 1 ? '#' : ' ';
        }
        console.log(line);
        line = '';
    }
}

const solution = R.pipe(compile, runRobot, drawShip);

module.exports = solution;