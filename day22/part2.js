const R = require('ramda');
const debug = x => { debugger; return x; };

//const n = 119315717514047n;
//const t = 101741582076661n;
const n = 10007;
const t = 9773;

const lineMatch = /([^-\d]*)(-?\d+)?/;
const parseLine = R.pipe(R.trim, R.match(lineMatch), R.tail, R.zipObj(['action', 'value']), R.evolve({ action: R.trim, value: parseInt }));
const parseInput = R.pipe(R.trim, R.split('\n'), R.map(parseLine));

const applyShuffle = (card, shuffle) => {
    if (shuffle.action === 'deal into new stack') {
        //return card;
        return (n - 1) - card;
    } else if (shuffle.action === 'deal with increment') {
        return (card * shuffle.value);
        return (card * shuffle.value) % n;
    } else if (shuffle.action === 'cut') {
        return card - shuffle.value;
        return (card - shuffle.value + n) % n;
    }
};
const applyShuffles = R.curry((card, shuffles) => R.reduce(applyShuffle, card, shuffles));

const modPow = (b,e,m) => {
    if (m == 1n) return 0n;
    let r = 1n;
    b = b % m;
    while (e > 0n) {
        if (e % 2n === 1n) {
            r = (r * b) % m;
        }
        e = e >> 1n;
        b = (b * b) % m;
    }
    return r;
}

const loop = shuffles => {
    let start = 0;
    let card = start;
    let render = '';
    let nums = [];
    for(let i = 0; i < 5; i++) {
        nums.push(card);
        render += card + '\n';
        card = applyShuffles(card, shuffles);
    }
    render += card + '\n';
    console.log(render);
    
    let div = 0;
    for(let i = 2; i < nums.length; i++) {
        div = nums[i] / nums[i-1];
        console.log(div);
    }

    //console.log(div);
    //console.log(card * 750);
    //return (card * Math.pow(750, 1)) % n;
    //return card % n;

    // console.log(modPow(div * 2020n, t, n));
    console.log(div * nums[1]);
    return card;
};

const solution = R.pipe(parseInput, loop);

module.exports = solution;