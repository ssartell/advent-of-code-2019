const R = require('ramda');
const { compile, parseInput } = require('./intcodeComputer');
var fs = require('fs');
const debug = x => { debugger; return x; };

const toAscii = str => Array.from(str).map(x => x.charCodeAt(0));
const fromAscii = ascii => String.fromCharCode.apply(null, ascii);

const script = fs.readFileSync('./day21/part2.txt', 'ascii')
    .replace(/\r/g, '')
    .replace(/\n\n/g, '\n')
    .replace(/\/\/.*\n/g, '');

const run = prog => {
    prog.giveInputs(toAscii(script));
    prog.run();
    if (prog.hasOutput()) {
        let out = prog.getOutputs();
        console.log(fromAscii(out));
    }
    return prog.getOutput();
}

const solution = R.pipe(parseInput, compile, run);

module.exports = solution;