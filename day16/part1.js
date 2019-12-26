const R = require('ramda');
const debug = x => { debugger; return x; };

const parseInput = R.pipe(R.trim, R.split(''), R.map(parseInt));

const startPhase = [0, 1, 0, -1];
const getPattern = (i) => R.pipe(R.map(R.repeat(R.__, i + 1)), R.flatten)(startPhase);

const applyPhase = R.curry((signal, x, i) => {
    let pattern = getPattern(i);
    pattern = R.pipe(R.flatten, R.drop(1))(R.repeat(pattern, Math.ceil(signal.length / pattern.length) + 1));
    let sum = R.sum(R.zipWith(R.multiply, signal, pattern));
    return Math.abs(sum) % 10;
});
const applyPhases = signal => {
    for(let p = 0; p < 100; p++) {
        signal = signal.map(applyPhase(signal));
    }
    return signal;
}

const solution = R.pipe(parseInput, applyPhases, R.take(8), R.join(''));

module.exports = solution;