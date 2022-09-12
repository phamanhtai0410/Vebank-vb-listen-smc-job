
const fs = require('fs');
const path = require("path");
const thorify = require("thorify").thorify;
const Web3 = require("web3");
const Conf = require('../config');
const publisherHelper = require('../publisherHelper');
var Sentry = require('@sentry/node');


const PREFIX_JOB = "vb_job_lending::";
const START_BLOCK = "start";

let eventSupply = async function (instanceContract, startBlock, endBlock) {
    const logs = await instanceContract.getPastEvents('Supply',  {fromBlock: startBlock, toBlock: endBlock});
    console.log("supply");
    if (logs.length > 0) {
        for (let index = 0; index < logs.length; index++) {
            publisherHelper.sendMessage(Conf.Config.RABBIT.QUEUE_SUPPLY, logs[index])
        }
    }
}

let eventBorrow = async function (instanceContract, startBlock, endBlock) {
    const logs = await instanceContract.getPastEvents('Borrow',  {fromBlock: startBlock, toBlock: endBlock});
    if (logs.length > 0) {
        for (let index = 0; index < logs.length; index++) {
            publisherHelper.sendMessage(Conf.Config.RABBIT.QUEUE_BORROW, logs[index])
        }
    }
}

let eventRepay = async function (instanceContract, startBlock, endBlock) {
    const logs = await instanceContract.getPastEvents('Repay',  {fromBlock: startBlock, toBlock: endBlock});
    console.log("repay: ", logs)
    if (logs.length > 0) {
        for (let index = 0; index < logs.length; index++) {
            publisherHelper.sendMessage(Conf.Config.RABBIT.QUEUE_REPAY, logs[index])
        }
    }
}

let eventWithdraw = async function (instanceContract, startBlock, endBlock) {
    const logs =  await instanceContract.getPastEvents('Withdraw',  {fromBlock: startBlock, toBlock: endBlock});
    if (logs.length > 0) {
        for (let index = 0; index < logs.length; index++) {
            publisherHelper.sendMessage(Conf.Config.RABBIT.QUEUE_WITHDRAW, logs[index])
        }
    }
}

let eventReserveDataUpdated = async function (instanceContract, startBlock, endBlock) {
    const logs = await instanceContract.getPastEvents('ReserveDataUpdated',  {fromBlock: startBlock, toBlock: endBlock});
    if (logs.length > 0) {
        for (let index = 0; index < logs.length; index++) {
            publisherHelper.sendMessage(Conf.Config.RABBIT.QUEUE_UPDATE_RESERVE, logs[index])
        }
    }
}

async function listenEvent() {
    try {
        const web3server = thorify(new Web3(), Conf.Config.RPC_VECHAIN);
        let pathABI = path.join(__dirname, '../abi/Pool.json')
        let abi = fs.readFileSync(pathABI, {
            encoding: 'utf-8'
        });
        let loadABI = JSON.parse(abi);
        let tokenContract =  new web3server.eth.Contract(loadABI, Conf.Config.POOL_CONTRACT);
        let getBlockCurrent = await web3server.eth.getBlock("latest");
        getBlockCurrent = getBlockCurrent.number.toString();
        let connectRedis = await publisherHelper.initRedis();
        let keyStart = PREFIX_JOB + START_BLOCK;
        let startBlock = await connectRedis.get(keyStart);
        if (startBlock == "" || startBlock == null) {
            startBlock = Conf.Config.FILTER_FROM_BLOCK;
        }

        console.log({startBlock: startBlock, endBlock: getBlockCurrent})
        // Init Connection to RabbitMQ
        await publisherHelper.initRabbitMQ();
        // Init channelWrapper for Connection RabbitMQ
        await publisherHelper.channelWrapper();
        await eventSupply(tokenContract, startBlock, getBlockCurrent);
        await eventBorrow(tokenContract, startBlock, getBlockCurrent);
        await eventRepay(tokenContract, startBlock, getBlockCurrent);
        await eventWithdraw(tokenContract), startBlock, getBlockCurrent;
        await eventReserveDataUpdated(tokenContract, startBlock, getBlockCurrent);

        await connectRedis.set(keyStart, getBlockCurrent);
        console.log(`*** Scan fromBlock: ${startBlock} to endBlock: ${getBlockCurrent} success! ***`)
    } catch (err) {
        console.error(`[job.cron.lending] ERROR: ${err}`);
        await Sentry.captureException(err);
        throw err;
    }
}

async function cron_lending() {
    Sentry.init({
        dsn: Conf.Config.SENTRY_DSN,
        tracesSampleRate: 1.0,
        debug: true
      });
    await listenEvent();
    
}

async function main() {
    console.log("start")
    await cron_lending();
    console.log("end.")
    process.exit();
}

main();