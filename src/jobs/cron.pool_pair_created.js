
const fs = require('fs');
const path = require("path");
const thorify = require("thorify").thorify;
const Web3 = require("web3");
const Conf = require('../config');
const publisherHelper = require('../publisherHelper');

let eventPairCreated = async function (instanceContract) {
    console.log("Conf.Config.FILTER_FROM_BLOCK ", Conf.Config.FILTER_FROM_BLOCK)
    instanceContract.getPastEvents('PairCreated',  {fromBlock: Conf.Config.FILTER_FROM_BLOCK, toBlock: Conf.Config.FILTER_TO_BLOCK}).then(logs =>{
        if (logs.length > 0) {
            for (let index = 0; index < logs.length; index++) {
                publisherHelper.sendMessage(Conf.Config.RABBIT.QUEUE_PAIR_CREATED, logs[index])
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
    let pathABI = path.join(__dirname, '../abi/VebankV2Factory.json')
    let abi = fs.readFileSync(pathABI, {
        encoding: 'utf-8'
    });
    let loadABI = JSON.parse(abi);
    try {
        let tokenContract =  new web3server.eth.Contract(loadABI, Conf.Config.VB_V2_FACTORY_CONTRACT);
        await eventPairCreated(tokenContract);
    } catch (err) {
        console.error(`[job.cron.pool_pair_created] ERROR: ${err}`);
        await Sentry.captureException(err);
        throw err
    }
}

async function pool_pair_created() {
    Sentry.init({
        dsn: Conf.Config.SENTRY_DSN,
        tracesSampleRate: 1.0,
        debug: true
      });
    await listenEvent();
}

pool_pair_created();