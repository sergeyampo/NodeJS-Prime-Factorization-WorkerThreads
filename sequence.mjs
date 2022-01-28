import http from 'node:http';
import {getPrimeMultipliers} from "./getPrimeMultipliers.mjs";

BigInt.prototype.toJSON = function() { return this.toString() }

const makeResponse = (res, data) => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);
    const numberToCalc = BigInt(pathname.substring(1)) || BigInt(2);
    const arrayOfMultipliers = getPrimeMultipliers(numberToCalc);

    makeResponse(res, arrayOfMultipliers);
});

process.on('uncaughtException', (err) => {
    console.error(err);
});

process.on('unhandledRejection', (err) => {
    console.error(err);
})

server.listen(3000);
