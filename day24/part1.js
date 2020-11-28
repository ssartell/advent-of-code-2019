const { right } = require('inquirer/lib/utils/readline');
const R = require('ramda');
const debug = x => { debugger; return x; };

const mask =            0b1111111111111111111111111;
const leftShiftMask =   0b1111011110111101111011110;
const rightShiftMask =  0b0111101111011110111101111;

const parseInput = R.pipe(R.trim, R.replace(/\r\n/g, ''), R.reverse);

const toScan = R.pipe(x => x.toString(2).substr(-25).padStart(25, '0'), R.replace(/0/g, '.'), R.replace(/1/g, '#'), R.splitEvery(5), R.map(R.split('')));
const log = R.pipe(toScan, R.map(R.pipe(R.join(''), console.log)), x => console.log(" "));

const toBinary = R.reduce((int, x) => (int << 1) | (x === '#'), 0);

const tick = (layout) => {
    let a = layout;
    let b = layout << 5;
    let c = layout >> 5;
    let d = (layout << 1) & leftShiftMask;
    let e = (layout >> 1) & rightShiftMask;

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
    let layouts = new Set();
    let layout = initial;
    while(true) {
        layouts.add(layout);
        layout = tick(layout);
        if (layouts.has(layout))
            return layout;
    }
}

const solution = R.pipe(parseInput, toBinary, run);

module.exports = solution;