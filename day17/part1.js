const R = require('ramda');
const compile = require('./intcodeComputer');

const parseInput = R.pipe(R.trim, R.split(','), R.map(parseInt));

const run = prog => {
    let render = '';
    let map = [];
    let [x, y] = [0, 0];
    while(!prog.isHalted()) {
        prog.run();
        let code = prog.getOutput();
        let char = String.fromCharCode(code);
        render += char;
        if (code === 10) {
            y++;
            x = 0;
        } else {
            map[y] = map[y] || [];
            map[y][x] = char;
            x++;
        }
    }
    
    let sum = 0;
    for(let y = 1; y < map.length - 1; y++) {
        for(let x = 1; x < map[0].length - 1; x++) {
            if (map[y][x] === '#' 
                && map[y-1][x] === '#' 
                && map[y+1][x] === '#' 
                && map[y][x-1] === '#'
                && map[y][x+1] === '#') {
                sum += x * y;
            }
        }
    }
    return sum;
}

const solution = R.pipe(parseInput, compile, run);

module.exports = solution;