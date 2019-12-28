const R = require('ramda');
const compile = require('./intcodeComputer');

const parseInput = R.pipe(R.trim, R.split(','), R.map(parseInt));

const getReading = (code, x, y) => {
    let prog = compile(code);
    prog.run()
    prog.giveInput(x);
    prog.run();
    prog.giveInput(y);
    prog.run();
    return prog.getOutput(); 
};

const run = code => {
    let [x, y] = [0, 0];
    while(true) {
        if (getReading(code, x + 99, y) === 0) {
            y++;
        } else if (getReading(code, x, y + 99) === 0) {
            x++;
        } else {
            return x * 10000 + y;
        }
    }
}

const solution = R.pipe(parseInput, run);

module.exports = solution;