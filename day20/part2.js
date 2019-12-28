const R = require('ramda');
const aStar = require('../graph-traversal/a-star');
const debug = x => { debugger; return x; };

const parseInput = R.pipe(R.split('\r\n'), R.map(R.split('')));

const isSpace = x => x === '.';
const isWall = x => x === '#';
const isNothing = x => x === ' ';
const isLabel = x => !isSpace(x) && !isWall(x) && !isNothing(x);
const getKey = pos => `${pos.x},${pos.y}`;
const getKey2 = pos => `${pos.x},${pos.y},${pos.z}`;
const dirs = [{x: 1, y: 0}, {x: 0, y: -1}, {x: -1, y: 0}, {x: 0, y: 1}];
const add = (pos, dir) => ({ 
    x: pos.x + dir.x,
    y: pos.y + dir.y,
    z: pos.z,
    steps: pos.steps + 1,
});

const findWarps = map => {
    let warpLabels = new Map();
    let start = {};
    let end = {};
    for(let i = 0; i < 2; i++) {
        for(let y = 0; y < map.length; y++) {
            for(let x = 0; x < map[0].length - 2; x++) {
                if (isLabel(map[y][x + 1]) && (isSpace(map[y][x]) || isSpace(map[y][x + 2]))) {
                    let label = (map[y][x] + map[y][x + 1] + map[y][x + 2]).replace('.', '');
                    let point = isSpace(map[y][x]) ? { x, y } : { x: x + 2, y };
                    if (i === 1) 
                        point = { x: point.y, y: point.x };

                    if (label === 'AA') {
                        start = point;
                    } else if (label == 'ZZ') {
                        end = point;
                    } else {
                        let warpPoints = warpLabels.get(label) || [];
                        warpPoints.push(point);
                        warpLabels.set(label, warpPoints);
                    }                    
                }
            }
        }
        map = R.transpose(map);
    }
    
    let warps = new Map();
    for(let label of warpLabels.keys()) {
        let warpPoints = warpLabels.get(label);
        warps.set(getKey(warpPoints[0]), warpPoints[1]);
        warps.set(getKey(warpPoints[1]), warpPoints[0]);
    }

    let charAt = p => map[p.y][p.x];
    return aStar(
        {...start, z: 0, steps: 0},
        p => p.x === end.x && p.y === end.y && p.z === 0,
        p => {
            let neighbors = [];
            for(let dir of dirs) {
                let newPos = add(p, dir);
                if (isSpace(charAt(newPos)))
                    neighbors.push(newPos);
            }
            for(let warp of warps.keys()) {
                if (warp === getKey(p)) {
                    let dest = warps.get(warp);
                    let upDown = (2 === p.x || p.x === map[0].length - 3) || (2 === p.y || p.y === map.length - 3) ? -1 : 1;
                    if (p.z + upDown >= 0)
                        neighbors.push({ ...dest, z: p.z + upDown, steps: p.steps + 1 });
                }                    
            }
            return neighbors;
        },
        p => p.steps,
        p => 0,
        getKey2
    );
};

const solution = R.pipe(parseInput, findWarps);

module.exports = solution;