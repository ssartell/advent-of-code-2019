const R = require('ramda');
const bfs = require('../graph-traversal/bfs');
const debug = x => { debugger; return x; };

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
        if (!isWall(map[newPos.y][newPos.x])) {
            neighbors.push(newPos);
            if (newPos.x < 0 || newPos.y < 0)
                debugger;
        }
    }
    return neighbors;
});

const shortestPathKey = (paths, notVisited, visited, current) => {
    return R.join('', R.sortBy(R.identity, visited)) + '-' + current;
}

const shortestPath = (paths, notVisited, visited, current) => {
    if (notVisited.length === 0)
        return 0;

    let min = Infinity;
    for(let key of notVisited) {
        let path = `${current}->${key}`;
        let pathInfo = paths.get(path);
        if (R.without(visited, pathInfo.doors).length === 0) {
            let newMin = pathInfo.steps + shortest(paths, R.without([key], notVisited), [...visited, key], key);
            min = R.min(min, newMin);
        }
    }

    return min;
};

const shortest = R.memoizeWith(shortestPathKey, shortestPath);

const crosswalk = map => {
    let locations = new Map();
    let keys = [];
    for(let y = 0; y < map.length; y++) {
        for(let x = 0; x < map[0].length; x++) {
            let char = map[y][x];
            if (isWall(char) || isSpace(char)) {
                continue;
            } else {
                if (isKey(char)) 
                    keys.push(char);
                locations.set(char, { x, y, steps: 0, doors: [] });
            }
        }
    }
    
    let targets = Array.from(locations.keys()).filter(x => isEntrance(x) || isKey(x));
    let graph = new Map();
    for(let start of targets) {
        let location = locations.get(start);
        let distances = new Map();
        bfs(location, pos => {
            let end = map[pos.y][pos.x];
            if (isKey(end) || isEntrance(end)) {
                distances.set(end, pos);
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
    
    return shortest(paths, keys, [], '@');
};

const solution = R.pipe(parseInput, crosswalk);

module.exports = solution;