const R = require('ramda');
const bigInt = require('big-integer');
const debug = x => { debugger; return x; };

const deckSize = 119315717514047;
const shuffleTimes = 101741582076661;

const lineMatch = /([^-\d]*)(-?\d+)?/;
const parseLine = R.pipe(R.trim, R.match(lineMatch), R.tail, R.zipObj(['action', 'value']), R.evolve({ action: R.trim, value: parseInt }));
const parseInput = R.pipe(R.trim, R.split('\n'), R.map(parseLine));

const mod = (x, m) => ((x % m) + m) % m;
const expand = (a, b, m) => ({a: bigInt(a.a).multiply(b.a).mod(m).toJSNumber(), b: bigInt(b.a).multiply(a.b).add(b.b).mod(m).toJSNumber()});

const apply = R.curry((card, state) => mod(state.a * card + state.b, deckSize));
const log = x => {
    console.log(`${x.a} * x + ${x.b} mod ${deckSize}`);
    return x;
};

const applyShuffle = (state, shuffle) => {
    if (shuffle.action === 'deal into new stack') {
        return expand(state, {a: -1, b: -1}, deckSize);
    } else if (shuffle.action === 'deal with increment') {
        return expand(state, {a: shuffle.value, b: 0}, deckSize);
    } else if (shuffle.action === 'cut') {
        return expand(state, {a: 1, b: -shuffle.value}, deckSize);
    }
};
const applyShuffles = (shuffles) => R.reduce(applyShuffle, {a: 1, b: 0}, shuffles);

const repeat = R.curry((times, state) => {
    let powerShuffle = state;
    let result = {a: 1, b: 0};
    while(times > 0) {
        if (times % 2 === 1)
            result = expand(result, powerShuffle, deckSize);
        powerShuffle = expand(powerShuffle, powerShuffle, deckSize);
        times = Math.floor(times / 2);
    }
    return result;
});

const solution = R.pipe(parseInput, applyShuffles, repeat(shuffleTimes), log, apply(2020));

// and then punch the formula into wolfram alpha to solve for x.. :D

module.exports = solution;