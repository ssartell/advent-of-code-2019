const R = require('ramda');
const splitDigits = require('../utils').splitDigits;
const C = require('js-combinatorics');

const parseInput = R.pipe(R.trim, R.split(','), R.map(parseInt));

const createIntcodeComputer = (code) => {
    code = [...code];
    let i = 0;
    let halted = false;
    let inputs = [];
    let output = undefined;
    let relativeBase = 0;

    const getOpcode = x => x[1] * 10 + x[0];
    const getModes = R.drop(2);
    const getValue = R.curry((modes, j) => {
        let mode = modes[j - 1];
        let raw = code[i + j];
        if (mode === 0) {
            return code[raw] || 0;
        } else if (mode === 1) {
            return raw || 0;
        } else if (mode === 2) {
            return code[relativeBase + raw] || 0;
        }
    });
    
    const setValue = R.curry((modes, j, value) => {
        let mode = modes[j - 1];
        let raw = code[i + j];
        if (mode === 0) {
            code[raw] = value
        } else if (mode === 1) {
            throw 'nope';
        } else if (mode === 2) {
            code[relativeBase + raw] = value;
        }
    });

    const giveInput = input => {
        inputs.push(input);
    };

    const getOutput = () => {
        while (code[i] !== 99) {
            let digits = [...splitDigits(code[i]), 0, 0, 0];
            let opcode = getOpcode(digits);
            modes = getModes(digits);

            let read = getValue(modes);
            let write = setValue(modes);

            if (opcode === 1) {
                write(3, read(1) + read(2));
                i += 4;
            } else if (opcode === 2) {
                write(3, read(1) * read(2));
                i += 4;
            } else if (opcode === 3) {
                write(1, inputs.shift());
                i += 2;
            } else if (opcode === 4) {
                output = read(1);
                i += 2;
                return output;
            } else if (opcode === 5) {
                if (read(1) !== 0) {
                    i = read(2);
                } else {
                    i += 3;
                }
            } else if (opcode === 6) {
                if (read(1) === 0) {
                    i = read(2);
                } else {
                    i += 3;
                }
            } else if (opcode === 7) {
                write(3, read(1) < read(2) ? 1 : 0);
                i += 4;
            } else if (opcode === 8) {
                write(3, read(1) === read(2) ? 1 : 0);
                i += 4;
            } else if (opcode === 9) {
                relativeBase += read(1);
                i += 2;
            }
        }
    
        halted = true;
        return output;
    };
    
    const isHalted = () => halted;

    return {
        giveInput,
        getOutput,
        isHalted
    };
};

const execute = prog => {
    prog.giveInput(2);
    while(!prog.isHalted()) {
        console.log(prog.getOutput());
    }
    return prog.getOutput();
}

const solution = R.pipe(parseInput, createIntcodeComputer, execute);

module.exports = solution;