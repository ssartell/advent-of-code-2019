const R = require('ramda');
const debug = x => { debugger; return x; };

const toChems = R.pipe(R.split(' '), R.zipObj(['quantity', 'chemical']), R.evolve({ quantity: parseInt }));
const parseLine = R.pipe(R.split(' => '), R.adjust(0, R.pipe(R.split(', '), R.map(toChems))), R.adjust(1, toChems), R.zipObj(['ingredients', 'result']));
const parseInput = R.pipe(R.trim, R.split('\r\n'), R.map(parseLine));

const toReactionsMap = reactions => {
    let map = new Map();
    for(let reaction of reactions) {
        map.set(reaction.result.chemical, reaction);
    }
    return map;
}

const minimumChemical = R.curry((chemical, quantity, leftovers, map) => {
    let reaction = map.get(chemical);
    if (chemical === 'ORE') return quantity;
    
    let needed = quantity;
    if (leftovers.has(chemical)) {
        let leftover = leftovers.get(chemical);
        let taking = Math.min(needed, leftover);
        leftovers.set(chemical, leftover - taking);
        needed -= taking;
    }

    if (needed === 0) return 0;

    let times = Math.ceil(needed / reaction.result.quantity);    
    let total = 0;
    for(let ingredient of reaction.ingredients) {
        total += minimumChemical(ingredient.chemical, ingredient.quantity * times, leftovers, map);
    }

    leftovers.set(chemical, times * reaction.result.quantity - needed);

    return total;
});

const solution = R.pipe(parseInput, toReactionsMap, minimumChemical('FUEL', 1, new Map()));

module.exports = solution;