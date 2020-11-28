const R = require('ramda');
const debug = x => { debugger; return x; };

const mask =            0b1111111111111111111111111;
const leftShiftMask =   0b1111011110111101111011110;
const rightShiftMask =  0b0111101111011110111101111;
const withoutCenter =   0b1111111111110111111111111;

const outerTop =        0b1111100000000000000000000;
const outerBottom =     0b0000000000000000000011111;
const outerLeft =       0b1000010000100001000010000;
const outerRight =      0b0000100001000010000100001;
const innerTop =        0b0000000100000000000000000;
const innerBottom =     0b0000000000000000010000000;
const innerLeft =       0b0000000000010000000000000;
const innerRight =      0b0000000000000100000000000;

const parseInput = R.pipe(R.trim, R.split('\n'), R.map(R.pipe(R.trim, R.split(''))));

const toScan = R.pipe(x => x.toString(2).substr(-25).padStart(25, '0'), R.replace(/0/g, '.'), R.replace(/1/g, '#'), R.splitEvery(5), R.map(R.split('')));
const log = R.pipe(toScan, R.map(R.pipe(R.join(''), console.log)), x => console.log(" "));

const toBinary = (scan) => {
    let int = 0;
    for(let row of scan) {
        for(let space of row) {
            int = int << 1 | (space === '#' ? 1 : 0);
        }
    }
    return int;
}

const countBits = n => (n === 0) ? 0 : (n & 1) + countBits(n >>> 1);

const min = R.reduce(R.min, Infinity);
const max = R.reduce(R.max, -Infinity);

const fromCoords = (x, y) => y * 5 + x;
const getBit = (layout, x, y) => (layout >> (24 - fromCoords(x, y))) & 1;

const tick = (levels) => {
    let depths = Object.keys(levels).map(Number);    
    depths = R.sortBy(R.identity, R.concat(depths, [max(depths) + 1, min(depths) - 1]));

    let newLevels = {};

    for(let depth of depths) {
        let newlayout = 0;
        let layout = levels[depth];

        let a = layout & withoutCenter;
        let b = layout << 5;
        let c = layout >> 5;
        let d = (layout << 1) & leftShiftMask;
        let e = (layout >> 1) & rightShiftMask;

        for(let y = 0; y < 5; y++) {
            for(let x = 0; x < 5; x++) {
                let bit = getBit(a, x, y);
                let count = getBit(b, x, y) + getBit(c, x, y) + getBit(d, x, y) + getBit(e, x, y);

                if (y === 0)
                    count += countBits((levels[depth - 1] || 0) & innerTop);
                if (y === 4)
                    count += countBits((levels[depth - 1] || 0) & innerBottom);
                if (x === 0)
                    count += countBits((levels[depth - 1] || 0) & innerLeft);
                if (x === 4)
                    count += countBits((levels[depth - 1] || 0) & innerRight);
                if (x === 2 && y === 1)
                    count += countBits((levels[depth + 1] || 0) & outerTop);
                if (x === 2 && y === 3)
                    count += countBits((levels[depth + 1] || 0) & outerBottom);
                if (x === 1 && y === 2)
                    count += countBits((levels[depth + 1] || 0) & outerLeft);
                if (x === 3 && y === 2)
                    count += countBits((levels[depth + 1] || 0) & outerRight);

                let hasInsect = (bit === 1 && count === 1) || (bit === 0 && (count === 1 || count === 2));
                newlayout = (newlayout << 1) | hasInsect;
            }
        }

        newLevels[depth] = newlayout & withoutCenter;
    }

    return newLevels;
}

const run = (initial) => {
    let levels = {0: initial};
    for(let i = 0; i < 200; i++) {
        levels = tick(levels);
    }

    return levels
}

const totalBugs = R.pipe(R.values, R.map(countBits), R.sum);

const solution = R.pipe(parseInput, toBinary, run, totalBugs);

module.exports = solution;