import {parentPort, isMainThread} from "node:worker_threads";

if(!isMainThread) {
    parentPort.on('message', (n) => {
        const res = getPrimeMultipliers(n)
        parentPort.postMessage(res);
    });

    process.on('uncaughtException', (err) => {
        console.error(err);
    });

    process.on('unhandledRejection', (err) => {
        console.error(err);
    });
}

export function getPrimeMultipliers(n) {
    const factors = [];
    let divisor = BigInt(2);
    while (n >= 2) {
        if (n % divisor == 0) {
            factors.push(divisor);
            n = n / divisor;
        } else {
            ++divisor;
        }
    }
    return factors;
}
