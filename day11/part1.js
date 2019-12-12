const R = require('ramda');
const compile = require('./intcodeComputer');
const debug = x => { debugger; return x; };

const runRobot = prog => {
    let dir = { x: 0, y: -1};
    let pos = { x: 0, y: 0 };
    let panels = new Map();

    let getKey = pos => `${pos.x},${pos.y}`;
    let getColor = pos => panels.get(getKey(pos)) || 0;
    let setColor = (pos, color) => panels.set(getKey(pos), color);

    let turnLeft = dir => ({ x: -dir.y, y: dir.x });
    let turnRight = dir => ({ x: dir.y, y: -dir.x });

    while(!prog.isHalted()) {
        prog.giveInput(getColor(pos));
        prog.run();
        setColor(pos, prog.getOutput());
        prog.run();
        pos = { x: pos.x + dir.x, y: pos.y + dir.y };
        dir = prog.getOutput() === 0 ? turnLeft(dir) : turnRight(dir);
    }
    return panels.size;
}

const solution = R.pipe(compile, runRobot);

module.exports = solution;