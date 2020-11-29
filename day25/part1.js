const R = require('ramda');
const { compile, parseInput } = require('./intcodeComputer');
const debug = x => { debugger; return x; };

const rl = require("readline").createInterface({ input: process.stdin, output: process.stdout });
const ask = q => new Promise(resolve => rl.question(q, resolve));

const bootUp = async (code) => {
    let comp = compile(code);
    while(!comp.isHalted()) {
        comp.run();

        if (comp.hasOutput()) {
            let out = comp.getOutputs();
            console.log(String.fromCharCode.apply(null, out));
        }

        if (comp.needsInput()) {
            let answer = await ask('') + String.fromCharCode(10);
            comp.giveInputs(answer.split('').map(x => x.charCodeAt(0)));
        }
    }
}

const solution = R.pipe(parseInput, bootUp);

module.exports = solution;