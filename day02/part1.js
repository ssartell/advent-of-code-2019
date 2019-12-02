const R = require('ramda');

const parseInput = R.pipe(R.trim, R.split(','), R.map(parseInt));

const ops = {
    1: (code, i) => {
        code[code[i + 3]] = code[code[i + 1]] + code[code[i + 2]];
    },
    2: (code, i) => {
        code[code[i + 3]] = code[code[i + 1]] * code[code[i + 2]];
    }
}

const loop = code => {
    code[1] = 12;
    code[2] = 2;

    let i = 0;
    while (code[i] !== 99) {
        let op = ops[code[i]];
        op(code, i);
        i += 4;
    }

    return code[0];
}

const solution = R.pipe(parseInput, loop);

module.exports = solution;