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

const loop = (code, noun, verb) => {
    code[1] = noun;
    code[2] = verb;

    let i = 0;
    while (code[i] !== 99) {
        let op = ops[code[i]];
        op(code, i);
        i += 4;
    }

    return code[0];
};

const tryAllParams = code => {
    for(let a = 0; a <= 99; a++) {
        for(let b = 0; b <= 99; b++) {
            if (loop(R.clone(code), a, b) === 19690720)
                return 100 * a + b;
        }
    }
};

const solution = R.pipe(parseInput, tryAllParams);

module.exports = solution;