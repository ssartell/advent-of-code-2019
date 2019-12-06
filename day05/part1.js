const R = require('ramda');
const debug = x => { debugger; return x; };

const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const ask = q => {
    return new Promise(resolve => rl.question(q, x => {
        resolve(x);
    }));
};

const parseInput = R.pipe(R.trim, R.split(','), R.map(parseInt));

function* splitDigits(x)  {
    while (x) {
        yield x % 10;
        x = Math.floor(x / 10);
    }
}

const getOpcode = R.pipe(R.take(2), x => x[1] * 10 + x[0]);
const getModes = R.drop(2);
const getValue = (code, i, mode) => mode === 0 ? code[code[i]] : code[i];

const ops = {
    1: async (code, i, modes) => {
        code[code[i + 3]] = getValue(code, i + 1, modes[0]) + getValue(code, i + 2, modes[1]);
        return i + 4;
    },
    2: async (code, i, modes) => {
        code[code[i + 3]] = getValue(code, i + 1, modes[0]) * getValue(code, i + 2, modes[1])
        return i + 4;
    },
    3: async (code, i) => {
        code[code[i + 1]] = parseInt(await ask('input: '));
        return i + 2;
    },
    4: async (code, i, modes) => {
        console.log(getValue(code, i + 1, modes[0]));
        return i + 2;
    }
};

const loop = async code => {
    let i = 0;
    while (code[i] !== 99) {
        let digits = [...splitDigits(code[i]), 0, 0, 0];
        let opcode = getOpcode(digits);
        let modes = getModes(digits);

        let op = ops[opcode];
        i = await op(code, i, modes);
    }

    return code[0];
};

const solution = async x => {
    x = parseInput(x);
    return await loop(x);
};

module.exports = solution;