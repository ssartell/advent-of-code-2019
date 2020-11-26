const R = require('ramda');
const { compile, parseInput } = require('./intcodeComputer');
const debug = x => { debugger; return x; };

const bootUp = code => {
    let comps = R.map(x => {
        let comp = compile(code);
        comp.run();
        if (comp.needsInput())
            comp.giveInput(x);
        comp.run();
        return comp;
    }, R.range(0, 50));

    let packetQueue = {};
    while(true) {
        for(let i = 0; i < 50; i++) {
            let comp = comps[i];
            
            while (comp.hasOutput()) {
                let [address, x, y] = comp.getOutputs(3);
                if (address === 255)
                    return y;
                packetQueue[address] = packetQueue[address] || [];
                packetQueue[address].push([x, y]);
            }

            if (comp.needsInput()) {
                let compQueue = packetQueue[i] || [];
                let input = compQueue[0];
                if (input !== undefined) {
                    comp.giveInputs(input);
                    packetQueue[i].shift();
                } else {
                    comp.giveInput(-1);
                }

                comp.run();                
            }
        }
    }
}

const solution = R.pipe(parseInput, bootUp);

module.exports = solution;