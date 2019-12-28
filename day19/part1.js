const R = require('ramda');
const compile = require('./intcodeComputer');
const debug = x => { debugger; return x; };

const parseInput = R.pipe(R.trim, R.split(','), R.map(parseInt));

const run = code => {
    let sum = 0;
    let render = '';
    for(let y = 0; y < 50; y++) {
        for(let x = 0; x < 50; x++) {
            let prog = compile(code);
            prog.run()
            prog.giveInput(x);
            prog.run();
            prog.giveInput(y);
            prog.run();
            let reading = prog.getOutput();
            sum += prog.getOutput();
            if (reading === 0) {
                render += '.';
            } else {
                render += '#';
            }
        }
        render += '\n'
    }
    console.log(render);
    return sum;
}

const solution = R.pipe(parseInput, run);

module.exports = solution;