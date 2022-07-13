
const fs = require('fs');
const path = require("path");
const thorify = require("thorify").thorify;
const Web3 = require("web3");
const Conf = require('../config');
const publisherHelper = require('../publisherHelper');
var Sentry = require('@sentry/node');


async function listenEvent() {
    try {
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
        let tokenContract =  new web3server.eth.Contract(loadABI, Conf.Config.POOL_CONTRACT);
        tokenContract.events.Borrow(async(error, msg) => {
            if (error) {
                console.error(`[events.borrow] SUBSCRIBE ERROR: ${error}`)
                await Sentry.captureException(error);
                throw error
            } else {
                publisherHelper.sendMessage(Conf.Config.RABBIT.QUEUE_BORROW, msg)
            }
        });
    } catch (err) {
        console.error(`[events.borrow] ERROR: ${err}`)
        await Sentry.captureException(err);
        throw err
    }
    
}

async function borrow() {
    Sentry.init({
        dsn: Conf.Config.SENTRY_DSN,
        tracesSampleRate: 1.0,
        debug: true
      });
    await listenEvent();
}

borrow();