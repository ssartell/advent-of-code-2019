const R = require('ramda');
const debug = x => { debugger; return x; };

const parseInput = R.pipe(R.trim, R.split(''), R.map(parseInt));

const first = R.curry((n, xs) => R.pipe(R.take(n), R.join(''), parseInt)(xs));

const applyPhases = signal => {
    let realLength = signal.length * 10000;
    let start = first(7, signal);
    let diff = realLength - start;
    let realSignal = R.pipe(R.reverse, R.repeat(R.__, Math.ceil(diff / signal.length)), R.flatten, R.take(diff))(signal);

    for(let p = 0; p < 100; p++) {
        let sum = 0;
        for(let i = 0; i < realLength - start; i++) {
            sum += realSignal[i];
            realSignal[i] = Math.abs(sum) % 10;
        }
    }

    return first(8, R.reverse(realSignal));
}

const solution = R.pipe(parseInput, applyPhases);

module.exports = solution;