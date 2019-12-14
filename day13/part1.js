const R = require('ramda');
const compile = require('./intcodeComputer');
let ansi = require('ansi');
let cursor = ansi(process.stdout);
const debug = x => { debugger; return x; };

const run = prog => {
    let screen = [];
    let i = 0;
    while(!prog.isHalted()) {
        prog.run();
        if (prog.isHalted()) break;
        let x = prog.getOutput();

        prog.run();
        if (prog.isHalted()) break;
        let y = prog.getOutput();

        prog.run();
        if (prog.isHalted()) break;
        let tileId = prog.getOutput();

        if (tileId === 0) {
            screen[y] = screen[y] || [];
            screen[y][x] = 0;
        } else if (tileId === 1) {
            screen[y] = screen[y] || [];
            screen[y][x] = 1;
        } else if (tileId === 2) {
            screen[y] = screen[y] || [];
            screen[y][x] = 1;
        } else if (tileId === 3) {
            screen[y] = screen[y] || [];
            screen[y][x] = 1;
        } else if (tileId === 4) {
            screen[y] = screen[y] || [];
            screen[y][x] = 1;
        }

        i++;
        
        //if (i % 1001 === 0) return screen; //draw(screen);
    }

    return tiles;
};

const draw = screen => {
    console.clear();

    for(let y = 0; y < screen.length; y++) {
        let row = '';
        for(let x = 0; x < screen[0].length; x++) {
            if (screen[y][x] === 0) {
                row += ' ';
            } else {
                row += '#';
            }
        }
        console.log(row);
    }

    return screen;
}

const solution = R.pipe(compile, run, draw, R.flatten, R.sum);

module.exports = solution;