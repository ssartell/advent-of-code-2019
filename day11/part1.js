const R = require('ramda');
const compile = require('./intcodeComputer');

const runRobot = prog => {
    let dir = { x: 0, y: 1 };
    let pos = { x: 0, y: 0 };
    let panels = new Map();

    let getKey = pos => `${pos.x},${pos.y}`;
    let getColor = pos => panels.get(getKey(pos)) || 0;
    let setColor = (pos, color) => panels.set(getKey(pos), color);

    let turnLeft = dir => ({ x: -dir.y, y: dir.x });
    let turnRight = dir => ({ x: dir.y, y: -dir.x });

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
    return panels.size;
}

const solution = R.pipe(compile, runRobot);

module.exports = solution;