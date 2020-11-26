const R = require('ramda');

const n = 10007;

const lineMatch = /([^-\d]*)(-?\d+)?/;
const parseLine = R.pipe(R.trim, R.match(lineMatch), R.tail, R.zipObj(['action', 'value']), R.evolve({ action: R.trim, value: parseInt }));
const parseInput = R.pipe(R.trim, R.split('\n'), R.map(parseLine));

const applyShuffle = (card, shuffle) => {
    if (shuffle.action === 'deal into new stack') {
        return (n - 1) - card;
    } else if (shuffle.action === 'deal with increment') {
        return (card * shuffle.value) % n;
    } else if (shuffle.action === 'cut') {
        return (card - shuffle.value + n) % n;
    }
};
const applyShuffles = R.curry((card, shuffles) => R.reduce(applyShuffle, card, shuffles));

const solution = R.pipe(parseInput, applyShuffles(2019));

module.exports = solution;