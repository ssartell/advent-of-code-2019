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
let steps = 0;
const updatePos = i => [pos[0] + dirs[i][0], pos[1] + dirs[i][1]];

const run = prog => {
    let key = `${pos[0]},${pos[1]}`;
    if (been.has(key)) return 0;
    been.add(`${pos[0]},${pos[1]}`);

    for(let i = 1; i < 5; i++) {
        prog.run();
        prog.giveInput(i);
        prog.run();
        let output = prog.getOutput();
        if (output === 0) {
            continue;
        } else if (output === 1) {
            pos = updatePos(i);
            steps++;
            let out = run(prog);
            if (out > 0) return out;
            prog.run();
            prog.giveInput(opposite(i));
            prog.run();
            pos = updatePos(opposite(i));
            steps--;
        } else if (output === 2) {
            steps++;
            return steps;
        }
    }
}

const solution = R.pipe(parseInput, compile, run);

module.exports = solution;