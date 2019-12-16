const R = require('ramda');
const compile = require('./intcodeComputer');

const dirs = {
    1: [0, 1],
    2: [0, -1],
    3: [-1, 0],
    4: [1, 0]
};

const parseInput = R.pipe(R.trim, R.split(','), R.map(parseInt));

const opposite = x => x < 3 ? 3 - x : 7 - x;

const been = new Set();
let pos = [0, 0];
let osPos = null;
const updatePos = (pos, i) => [pos[0] + dirs[i][0], pos[1] + dirs[i][1]];

const run = prog => {
    let key = `${pos[0]},${pos[1]}`;
    if (been.has(key)) return;
    been.add(`${pos[0]},${pos[1]}`);

    for(let i = 1; i < 5; i++) {
        prog.run();
        prog.giveInput(i);
        prog.run();
        let output = prog.getOutput();
        if (output === 0) {
            continue;
        } else if (output === 1 || output === 2) {
            pos = updatePos(pos, i);
            if (output === 2) osPos = pos;
            run(prog);
            prog.run();
            prog.giveInput(opposite(i));
            prog.run();
            pos = updatePos(pos, opposite(i));
        }
    }
}

const spread = (pos, step) => {
    let key = `${pos[0]},${pos[1]}`;
    if (!been.has(key)) return step - 1;
    been.delete(key);

    let max = 0;
    for(let i = 1; i < 5; i++) {
        let newMax = spread(updatePos(pos, i), step + 1);
        max = Math.max(max, newMax);
    }

    return max;
}

const howLong = () => {
    return spread(osPos, 0);
}

const solution = R.pipe(parseInput, compile, run, howLong);

module.exports = solution;