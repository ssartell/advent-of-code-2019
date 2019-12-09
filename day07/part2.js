const R = require('ramda');
const splitDigits = require('../utils').splitDigits;
const C = require('js-combinatorics');

const allPhaseSettings = C.permutation(R.range(5, 10)).toArray();

const parseInput = R.pipe(R.trim, R.split(','), R.map(parseInt));

const getOpcode = x => x[1] * 10 + x[0];
const getModes = R.drop(2);
const getValue = (code, i, mode) => mode === 0 ? code[code[i]] : code[i];

const runCode = ({code, i = 0, inputs, output}) => {
    while (code[i] !== 99) {
        let digits = [...splitDigits(code[i]), 0, 0, 0];
        let opcode = getOpcode(digits);
        let modes = getModes(digits);

        if (opcode === 1) {
            code[code[i + 3]] = getValue(code, i + 1, modes[0]) + getValue(code, i + 2, modes[1]);
            i += 4;
        } else if (opcode === 2) {
            code[code[i + 3]] = getValue(code, i + 1, modes[0]) * getValue(code, i + 2, modes[1])
            i += 4;
        } else if (opcode === 3) {
            code[code[i + 1]] = inputs.shift();
            i += 2;
        } else if (opcode === 4) {
            output = getValue(code, i + 1, modes[0]);
            i += 2;
            return { code, i, output, inputs, halt: false };
        } else if (opcode === 5) {
            if (getValue(code, i + 1, modes[0]) !== 0) {
                i = getValue(code, i + 2, modes[1]);
            } else {
                i += 3;
            }
        } else if (opcode === 6) {
            if (getValue(code, i + 1, modes[0]) === 0) {
                i = getValue(code, i + 2, modes[1]);
            } else {
                i += 3;
            }
        } else if (opcode === 7) {
            code[code[i + 3]] = getValue(code, i + 1, modes[0]) < getValue(code, i + 2, modes[1]) ? 1 : 0;
            i += 4;
        } else if (opcode === 8) {
            code[code[i + 3]] = getValue(code, i + 1, modes[0]) === getValue(code, i + 2, modes[1]) ? 1 : 0;
            i += 4;
        }
    }

    return { code, i, output, halt: true };
};

const tryPhaseSetting = R.curry((code, phaseSettings) => {
    let amplifiers = R.map(x => ({ code: [...code], i: 0, inputs: [x], output: 0, halt: false }), phaseSettings);
    var result = { output: 0, halt: false };
    while (!result.halt) {
        for(let i = 0; i < 5; i++) {
            amplifiers[i].inputs.push(result.output);
            result = amplifiers[i] = runCode(amplifiers[i]);
        }
    }

    return result.output;
});

const tryAllPhaseSettings = code => R.map(x => tryPhaseSetting(code, x), allPhaseSettings);
const max = R.reduce(R.max, -Infinity);

const solution = R.pipe(parseInput, tryAllPhaseSettings, max);

module.exports = solution;