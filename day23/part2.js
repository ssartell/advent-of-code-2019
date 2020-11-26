const R = require('ramda');
const { compile, parseInput } = require('./intcodeComputer');
const debug = x => { debugger; return x; };

const allPacketQueuesEmpty = R.pipe(R.values, R.all(R.isEmpty));
const isNetworkIdle = (comps, packetQueue) => {
    return R.all(x => x.needsInput(), comps) && allPacketQueuesEmpty(packetQueue);
}

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
    let nat;
    let idle = false;
    let lastY = undefined;
    while(true) {
        for(let i = 0; i < 50; i++) {
            let comp = comps[i];
            
            while (comp.hasOutput()) {
                let [address, x, y] = comp.getOutputs(3);
                if (address === 255) {
                    nat = [x, y];
                } else {
                    packetQueue[address] = packetQueue[address] || [];
                    packetQueue[address].push([x, y]);
                }
                idle = false;
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

            if (isNetworkIdle(comps, packetQueue)) {
                if (idle) {
                    let [x, y] = nat;
                    if (y === lastY)
                        return y;
                    //comps[0].giveInputs(nat);
                    let address = 0;
                    packetQueue[address] = packetQueue[address] || [];
                    packetQueue[address].push(nat);
                    lastY = y;
                }

                idle = true;
            }
        }
    }
}

const solution = R.pipe(parseInput, bootUp);

module.exports = solution;