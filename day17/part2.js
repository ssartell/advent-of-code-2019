const R = require('ramda');
const compile = require('./intcodeComputer');
const newline = 10;

const parseInput = R.pipe(R.trim, R.split(','), R.map(parseInt));

let turnLeft = dir => ({ x: dir.y, y: -dir.x });
let turnRight = dir => ({ x: -dir.y, y: dir.x });
let add = (pos, dir) => ({ x: pos.x + dir.x, y: pos.y + dir.y });
let hasScaffolding = (map, pos) => (map[pos.y] || [])[pos.x] === '#';

const walk = (map, pos) => {
    let dir = { x: 0, y: -1 };
    
    let moves = [];
    let move = '';
    let steps = 0;
    while(true) {
        let forward = add(pos, dir);
        if (hasScaffolding(map, forward)) {
            steps++;
            pos = forward;
        } else {
            if (steps > 0) moves.push(`${move}${steps}`);

            steps = 0;
            let left = turnLeft(dir);
            let right = turnRight(dir);
            if (hasScaffolding(map, add(pos, left))) {
                move = 'L';
                dir = left;
            } else if (hasScaffolding(map, add(pos, right))) {
                move = 'R';
                dir = right;
            } else {
                return moves;
            }
        }
    }
};

const toRoutine = R.pipe(R.map(x => `${x[0]},${x.substr(1)}`), R.join(','));
const mainFunction = (moves, A, B, C) => {
    return toRoutine(moves)
        .replace(new RegExp(A, 'g'), 'A')
        .replace(new RegExp(B, 'g'), 'B')
        .replace(new RegExp(C, 'g'), 'C');
}
const validMain = main => main.indexOf('R') < 0 && main.indexOf('L') < 0;

function *possibleRoutines(moves) {
    for(let i = 1; i < moves.length - 1; i++) {
        for(let j = i + 1; j < moves.length; j++) {
            let routine = toRoutine(R.slice(i, j, moves));
            if (routine.length > 20) continue;
            yield routine;
        }
    }
}

const toInputs = moves => {
    for(let A of possibleRoutines(moves)) {
        for(let B of possibleRoutines(moves)) {
            for(let C of possibleRoutines(moves)) {
                let main = mainFunction(moves, A, B, C);
                if (!validMain(main)) continue;
                return [main, A, B, C, 'N'];
            }
        }
    }
}

const run = prog => {
    prog[0] = 2;

    let render = '';
    let map = [];
    let [x, y] = [0, 0];
    let robot = {};
    let lastCode = 0;
    let mapDone = false;
    let inputs = [];
    while(!prog.isHalted()) {
        prog.run();
        if (prog.needsInput()) {
            console.log(render);
            render = '';
            let input = inputs.shift();
            console.log(input);
            while(input) {
                prog.giveInput(input.charCodeAt(0));
                input = input.substr(1);
                prog.run();
            }
            prog.giveInput(newline);
        } else if (prog.hasOutput()) {
            let code = prog.getOutput();
            let char = String.fromCharCode(code);
            render += char;
            if (code === newline && lastCode === newline) {
                console.log(render);
                render = '';

                if (!mapDone) {
                    mapDone = true;
                    inputs = toInputs(walk(map, robot));
                }
            }
            if (!mapDone) {
                if (code === newline) {
                    y++;
                    x = 0;
                } else {
                    if (char === '^') {
                        robot.x = x;
                        robot.y = y;
                    }

                    map[y] = map[y] || [];
                    map[y][x] = char;
                    x++;
                }
            }

            lastCode = code;
        }        
    }

    console.log(render);

    return lastCode;
}

const solution = R.pipe(parseInput, R.adjust(0, () => 2), compile, run);

module.exports = solution;