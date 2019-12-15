const R = require('ramda');
const compile = require('./intcodeComputer');
let ansi = require('ansi');
let cursor = ansi(process.stdout);
const debug = x => { debugger; return x; };

const parseInput = R.pipe(R.trim, R.split(','), R.map(parseInt));

const run = prog => {
    let screen = [];
    let [bx, by] = [0, 0];
    let [px, py] = [0, 0];
    let score = 0;
    let joystick = 0;
    while(!prog.isHalted()) {
        let outputs = [];
        joystick = Math.sign(px - bx);

        while(outputs.length < 3) {
            prog.run();
            if (prog.needsInput()) prog.giveInput(joystick);
            if (prog.hasOutput()) outputs.push(prog.getOutput());
            if (prog.isHalted()) break;
        }
        
        let [x, y, tileId] = outputs;

        if (x === -1 && y === 0) {
            score = tileId;
        } else {
            screen[y] = screen[y] || [];
            if (tileId === 0) {
                screen[y][x] = ' ';
            } else if (tileId === 1) {
                screen[y][x] = '#';
            } else if (tileId === 2) {
                screen[y][x] = '=';
            } else if (tileId === 3) {
                screen[y][x] = '_';
                [px, py] = [x, y];
            } else if (tileId === 4) {
                screen[y][x] = 'o';
                [bx, by] = [x, y];
            }
        }

        draw(screen);
    }

    return score;
};

const draw = screen => {
    console.clear();
    console.log(R.join('\n', screen.map(R.join(''))));
    return screen;
}

const solution = R.pipe(parseInput, R.adjust(0, x => 2), compile, run);

module.exports = solution;