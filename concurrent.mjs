import http from 'node:http';
import {cpus} from 'node:os';
import {Worker} from 'node:worker_threads';
import {once} from 'node:events';

BigInt.prototype.toJSON = function() { return this.toString() }

const availableCoresAmount = cpus().length;

const workers = [];

for(let i = 0; i < availableCoresAmount; ++i){
    workers.push(new Worker('./getPrimeMultipliers.mjs'));
}

const makeResponse = (res, data) => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(data));
}

/**
 *
 * @returns Worker
 */
const getWorker = (counter) => {
    return workers[counter % availableCoresAmount];
}

(async() => {
    let roundRobinCounter = 0;
    const server = http.createServer(async (req, res) => {
        const { pathname } = new URL(req.url, `http://${req.headers.host}`);
        const numberToCalc = BigInt(pathname.substring(1)) || BigInt(2);
        const worker = getWorker(roundRobinCounter++);
        worker.postMessage(numberToCalc);
        const arrayOfMultipliers = await once(worker, 'message');
        makeResponse(res, arrayOfMultipliers);
    });
    server.listen(3000);
})();



process.on('uncaughtException', (err) => {
    console.error(err);
});

process.on('unhandledRejection', (err) => {
    console.error(err);
})


