const R = require('ramda');
const bfs = require('../graph-traversal/bfs');
const astar = require('../graph-traversal/a-star');

const parseInput = R.pipe(R.trim, R.split('\r\n'), R.map(R.split('')));

const isWall = char => char === '#';
const isSpace = char => char === '.';
const isEntrance = char => char === '@';
const isKeyOrDoor = char => !isWall(char) && !isSpace(char) && !isEntrance(char);
const isKey = char => isKeyOrDoor(char) && char === char.toLowerCase();
const isDoor = char => isKeyOrDoor(char) && char === char.toUpperCase();

const dirs = [{x: 1, y: 0}, {x: 0, y: -1}, {x: -1, y: 0}, {x: 0, y: 1}];
const getKey = pos => `${pos.x},${pos.y}`;
const add = (pos, dir) => ({ 
    x: pos.x + dir.x, 
    y: pos.y + dir.y, 
    steps: pos.steps + 1,
    doors: R.clone(pos.doors),
});

const getNeighbors = R.curry((map, pos) => {
    let neighbors = [];
    for(let dir of dirs) {
        let newPos = add(pos, dir);
        if (!isWall(map[newPos.y][newPos.x]))
            neighbors.push(newPos);
    }
    return neighbors;
});

const isEnd = R.curry((keys, x) => x.keys.length === keys.length);
const canPass = (keys, doors) => R.without(keys, doors).length === 0;
const hasVisited = (keys, key) => R.contains(key, keys);
const getOptions = R.curry((paths, keys, current) => {
    let neighbors = [];
    for(var key of keys.filter(x => !hasVisited(current.keys, x))) {
        for(let i = 0; i < current.bots.length; i++) {
            let bot = current.bots[i];
            let pathKey = `${bot}->${key}`;
            let path = paths.get(pathKey);
            if (!path) continue;
            if (canPass(current.keys, path.doors))
                neighbors.push({ bots: R.adjust(i, x => key, current.bots), keys: [... current.keys, key], steps: current.steps + path.steps });
        }
    }
    return neighbors;
});

const crosswalk = map => {
    map[39][39] = '@'; map[39][40] = '#'; map[39][41] = '@';
    map[40][39] = '#'; map[40][40] = '#'; map[40][41] = '#';
    map[41][39] = '@'; map[41][40] = '#'; map[41][41] = '@';

    let locations = new Map();
    let keys = [];
    let e = 0;
    for(let y = 0; y < map.length; y++) {
        for(let x = 0; x < map[0].length; x++) {
            let char = map[y][x];
            if (isWall(char) || isSpace(char)) {
                continue;
            } else {
                if (isKey(char))
                    keys.push(char);
                if (isEntrance(char))
                    char += e++;
                locations.set(char, { x, y, steps: 0, doors: [] });
            }
        }
    }
    
    let targets = Array.from(locations.keys()).filter(x => isEntrance(x) || isKey(x));
    let graph = new Map();
    let minDist = Infinity;
    for(let start of targets) {
        let location = locations.get(start);
        let distances = new Map();
        bfs(location, pos => {
            let end = map[pos.y][pos.x];
            if (isKey(end) || isEntrance(end)) {
                distances.set(end, pos);
                if (pos.steps > 0)
                    minDist = R.min(minDist, pos.steps);
            } else if (isDoor(end)) {
                pos.doors.push(end.toLowerCase());
            }
        }, getNeighbors(map), getKey);
        graph.set(start, distances);
    }

    let paths = R.xprod(targets, targets)
        .reduce((a, x) => {
            a.set(`${x[0]}->${x[1]}`, graph.get(x[0]).get(x[1]));
            return a;
        }, new Map());
    
    let result = astar(
        { bots: ['@0', '@1', '@2', '@3'], keys: [], steps: 0 },
        isEnd(keys),
        getOptions(paths, keys), 
        x => x.steps,
        x => (keys.length - x.keys.length) * minDist,
        x => R.join('', R.sortBy(R.identity, x.keys)) + '-' + x.bots.join('')
    );
    console.log(result.keys.join(''));
    return result.steps;
};

const solution = R.pipe(parseInput, crosswalk);

module.exports = solution;