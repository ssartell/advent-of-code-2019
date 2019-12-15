const R = require('ramda');
const compile = require('./intcodeComputer');
let ansi = require('ansi');
let cursor = ansi(process.stdout);
const debug = x => { debugger; return x; };

const parseInput = R.pipe(R.trim, R.split(','), R.map(parseInt));

const run = prog => {
    let screen = [];
    let i = 0;
    while(!prog.isHalted() && !prog.needsInput()) {
        prog.run();
        if (prog.isHalted()) break;
        let x = prog.getOutput();

        prog.run();
        if (prog.isHalted()) break;
        let y = prog.getOutput();

        prog.run();
        if (prog.isHalted()) break;
        let tileId = prog.getOutput();

        screen[y] = screen[y] || [];
        if (tileId === 0) {
            screen[y][x] = ' ';
        } else if (tileId === 1) {
            screen[y][x] = '#';
        } else if (tileId === 2) {
            screen[y][x] = '=';
        } else if (tileId === 3) {
            screen[y][x] = '_';
        } else if (tileId === 4) {
            screen[y][x] = 'o';
        }

        i++;
    }

    return screen;
};

const draw = screen => {
    console.clear();
    console.log(R.join('\n', screen.map(R.join(''))));
    return screen;
}

const solution = R.pipe(parseInput, compile, run, draw, R.flatten, R.filter(x => x === '='), R.length);

module.exports = solution;