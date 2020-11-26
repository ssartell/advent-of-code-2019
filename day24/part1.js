const { right } = require('inquirer/lib/utils/readline');
const R = require('ramda');
const debug = x => { debugger; return x; };

const mask =            0b1111111111111111111111111;
const leftShiftMask =   0b1111011110111101111011110;
const rightShiftMask =  0b0111101111011110111101111;

const parseInput = R.pipe(R.trim, R.split('\n'), R.map(R.pipe(R.trim, R.split(''))));

const toScan = R.pipe(x => x.toString(2).padStart(25, '0'), R.reverse, R.splitEvery(5), R.map(R.split('')));
const toBinary = (scan) => {
    let int = 0;
    for(let row of R.reverse(scan)) {
        for(let space of R.reverse(row)) {
            int = int << 1 | (space === '#' ? 1 : 0);
        }
    }
    return int;
}

const tick = (layout) => {
    let a = layout;
    let b = layout << 5;
    let c = layout >> 5;
    let d = layout << 1 & leftShiftMask;
    let e = layout >> 1 & rightShiftMask;

    return (~b & ~c & ~d & e 
        | ~b & ~c & d & ~e 
        | ~b & c & ~d & ~e 
        | b & ~c & ~d & ~e 
        | ~a & c & ~d & ~e 
        | ~a & ~c & d & ~e 
        | ~a & ~b & d & ~e 
        | ~a & ~c & ~d & e 
        | ~a & ~b & ~d & e 
        | ~a & ~b & ~c & e)
        & mask;
}

const run = (initial) => {
    let prevLayouts = new Set();
    let prevLayout = initial;
    while(true) {
        let nextLayout = tick(prevLayout);
        if (prevLayouts.has(nextLayout))
            return nextLayout;
        prevLayouts.add(nextLayout);
        prevLayout = nextLayout;
    }
}

const solution = R.pipe(parseInput, toBinary, run);

module.exports = solution;