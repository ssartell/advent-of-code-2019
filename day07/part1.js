const R = require('ramda');
const splitDigits = require('../utils').splitDigits;
const C = require('js-combinatorics');

const parseInput = R.pipe(R.trim, R.split(','), R.map(parseInt));

const getOpcode = x => x[1] * 10 + x[0];
const getModes = R.drop(2);
const getValue = (code, i, mode) => mode === 0 ? code[code[i]] : code[i];

const ops = {
    1: (code, i, modes) => {
        code[code[i + 3]] = getValue(code, i + 1, modes[0]) + getValue(code, i + 2, modes[1]);
        return i + 4;
    },
    2: (code, i, modes) => {
        code[code[i + 3]] = getValue(code, i + 1, modes[0]) * getValue(code, i + 2, modes[1])
        return i + 4;
    },
    3: (code, i, modes, inputs) => {
        code[code[i + 1]] = inputs.shift();
        return i + 2;
    },
    4: (code, i, modes, inputs, outputs) => {
        outputs.push(getValue(code, i + 1, modes[0]));
        return i + 2;
    },
    5: (code, i, modes) => getValue(code, i + 1, modes[0]) !== 0 
        ? getValue(code, i + 2, modes[1]) 
        : i + 3,
    6: (code, i, modes) => getValue(code, i + 1, modes[0]) === 0
        ? getValue(code, i + 2, modes[1])
        : i + 3,
    7: (code, i, modes) => {
        code[code[i + 3]] = getValue(code, i + 1, modes[0]) < getValue(code, i + 2, modes[1]) ? 1 : 0;
        return i + 4;
    },
    8: (code, i, modes) => {
        code[code[i + 3]] = getValue(code, i + 1, modes[0]) === getValue(code, i + 2, modes[1]) ? 1 : 0;
        return i + 4;
    },
};

const runCode = R.curry((code, inputs) => {
    let outputs = [];
    let i = 0;
    while (code[i] !== 99) {
        let digits = [...splitDigits(code[i]), 0, 0, 0];
        let opcode = getOpcode(digits);
        let modes = getModes(digits);

        let op = ops[opcode];
        i = op(code, i, modes, inputs, outputs);
    }

    return outputs[0];
});

const amplifier = R.curry((program, phaseSetting, input) => program([phaseSetting, input]));
const thruster = R.curry((amplifier, phaseSettings, input) => R.apply(R.pipe, R.map(amplifier, phaseSettings))(input));
const max = R.reduce(R.max, -Infinity);
const findBestPhaseSettings = thruster => max(R.map(x => thruster(x, 0), C.permutation(R.range(0, 5)).toArray()))

const solution = R.pipe(parseInput, runCode, amplifier, thruster, findBestPhaseSettings);

module.exports = solution;