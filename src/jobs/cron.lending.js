
const fs = require('fs');
const path = require("path");
const thorify = require("thorify").thorify;
const Web3 = require("web3");
const Conf = require('../config');
const publisherHelper = require('../publisherHelper');

let eventSupply = async function (instanceContract) {
    instanceContract.getPastEvents('Supply',  {fromBlock: 12386138, toBlock: 12508322}).then(logs =>{
        if (logs.length > 0) {
            for (let index = 0; index < logs.length; index++) {
                publisherHelper.sendMessage(Conf.Config.RABBIT.QUEUE_SUPPLY, logs[index])
            }
        }
    })
}

let eventBorrow = async function (instanceContract) {
    instanceContract.getPastEvents('Borrow',  {fromBlock: 12386138, toBlock: 12508322}).then(logs =>{
        if (logs.length > 0) {
            for (let index = 0; index < logs.length; index++) {
                publisherHelper.sendMessage(Conf.Config.RABBIT.QUEUE_BORROW, logs[index])
            }
        }
    })
}

let eventRepay = async function (instanceContract) {
    instanceContract.getPastEvents('Repay',  {fromBlock: 12386138, toBlock: 12508322}).then(logs =>{
        if (logs.length > 0) {
            for (let index = 0; index < logs.length; index++) {
                publisherHelper.sendMessage(Conf.Config.RABBIT.QUEUE_REPAY, logs[index])
            }
        }
    })
}

let eventWithdraw = async function (instanceContract) {
    instanceContract.getPastEvents('Withdraw',  {fromBlock: 12386138, toBlock: 12508322}).then(logs =>{
        if (logs.length > 0) {
            for (let index = 0; index < logs.length; index++) {
                publisherHelper.sendMessage(Conf.Config.RABBIT.QUEUE_WITHDRAW, logs[index])
            }
        }
    })
}
async function listenEvent() {
    // Init Connection to RabbitMQ
    await publisherHelper.initRabbitMQ();
    // Init channelWrapper for Connection RabbitMQ
    await publisherHelper.channelWrapper();
    const web3server = thorify(new Web3(), Conf.Config.RPC_VECHAIN);
    let pathABI = path.join(__dirname, '../abi/Pool.json')
    let abi = fs.readFileSync(pathABI, {
        encoding: 'utf-8'
    });
    let loadABI = JSON.parse(abi);
    try {
        let tokenContract =  new web3server.eth.Contract(loadABI, Conf.Config.POOL_CONTRACT);
        await eventSupply(tokenContract);
        await eventBorrow(tokenContract);
        await eventRepay(tokenContract);
        await eventWithdraw(tokenContract);
    } catch (err) {
        console.error(`[job.cron.lending] ERROR: ${err}`)
        throw err
    }
}

listenEvent();